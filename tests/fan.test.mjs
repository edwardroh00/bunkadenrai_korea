import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {emptyProfile,validateProfile,calculateStats,parseBackup,exportBackup,importLegacyCart,matchSong,validDate,filterLiveEvents,isRecordableEvent} from '../fan-model.js';
const songs=(JSON.parse(await readFile(new URL('../data/songs.json',import.meta.url)))).songs;
const events=(JSON.parse(await readFile(new URL('../data/lives.json',import.meta.url)))).events;
const goods=(JSON.parse(await readFile(new URL('../data/goods.json',import.meta.url)))).goods;
const event={id:'example',date:'2026-10-11',name:'Test',setlistStatus:'complete',setlist:[{id:'one',rawTitle:songs[0].ja,songIds:[songs[0].id],kind:'song'},{id:'medley',rawTitle:songs[0].ja+' / '+songs[1].ja,songIds:[songs[0].id,songs[1].id],kind:'medley'},{id:'repeat',rawTitle:songs[0].ja,songIds:[songs[0].id],kind:'song'}]};
const attendance=(mode='venue',ids=event.setlist.map(x=>x.id))=>({id:`example@${mode}`,eventId:'example',mode,coverage:'full',heardEntryIds:ids,seat:'',memo:''});
test('a medley and repeat count each performance, concert coverage is distinct and online is separate',()=>{const p={...emptyProfile(),attendances:[attendance(),attendance('online')]};const s=calculateStats(p,songs,[event]);assert.equal(s.heard.length,2);assert.equal(s.rows[0].count,3);assert.equal(s.rows[0].concertCount,1);assert.equal(s.attendances.length,1);assert.equal(calculateStats(p,songs,[event],'online').rows[0].count,3);});
test('partial attendance counts only selected entries and reversing a visit removes its listening history',()=>{const p={...emptyProfile(),attendances:[{...attendance('venue',['medley']),coverage:'partial'}]};assert.equal(calculateStats(p,songs,[event]).rows[0].count,1);assert.equal(calculateStats({...p,attendances:[]},songs,[event]).heard.length,0);});
test('unknown setlist and conflicting repeats flag uncertainty without inventing an extra listen',()=>{const conflict={...event,setlist:[{...event.setlist[0],occurrences:1,reportedOccurrences:2,occurrenceStatus:'conflicting'}]};const p={...emptyProfile(),attendances:[attendance('venue',['one'])]};const s=calculateStats(p,songs,[conflict]);assert.equal(s.rows[0].count,1);assert.equal(s.uncertain,1);});
test('duplicate visits and invalid heard-entry ids cannot enter saved or imported records',()=>{const a=attendance();assert.throws(()=>validateProfile({...emptyProfile(),attendances:[a,a]},songs,[event],goods),/중복/);assert.throws(()=>validateProfile({...emptyProfile(),attendances:[attendance('venue',['invalid'])]},songs,[event],goods),/관람 기록/);});
test('backup preserves custom concerts, personal sizes, attendance, and favorites',()=>{const e={...event,id:'custom-one',venue:'Hall',city:'Seoul'},p={...emptyProfile(),customEvents:[e],attendances:[{...attendance(),id:'custom-one@venue',eventId:'custom-one'}],favorites:[songs[0].id],collection:[{id:'owned',productId:goods[0].id,name:goods[0].ko,state:'owned',quantity:2,size:'M',color:'',fit:'잘 맞아요',acquiredAt:'2026-10-10',memo:'my note',measures:{length:64,width:52}}]};const valid=validateProfile(p,songs,events,goods),restored=parseBackup(JSON.stringify(exportBackup(valid)),songs,events,goods);assert.deepEqual(restored,valid);assert.equal(calculateStats(valid,songs,events).ownedUnits,2);assert.equal(calculateStats(valid,songs,events).rows[0].count,3);});
test('legacy cart conversion is idempotent and only received goods become owned',()=>{const records=['received','ordered','planned','cancelled'].map((status,i)=>({id:'old-'+i,productId:goods[0].id,status,quantity:1,option:'L',receivedAt:'2026-10-11T12:00',memo:''}));const p=importLegacyCart(records,emptyProfile(),goods);assert.deepEqual(p.collection.map(r=>r.state),['owned','awaiting','wishlist']);assert.equal(importLegacyCart(records,p,goods).collection.length,3);assert.equal(calculateStats(p,songs,events).ownedUnits,1);});
test('all public concert entries use existing song ids and unique dates/ids',()=>{assert.equal(events.length,28);assert.equal(new Set(events.map(e=>e.id)).size,events.length);const ids=new Set(songs.map(s=>s.id));for(const e of events){assert.ok(validDate(e.date));assert.equal(new Set(e.setlist.map(x=>x.id)).size,e.setlist.length);for(const x of e.setlist)for(const id of x.songIds)assert.ok(ids.has(id));}});
test('ZOMCRA includes every held date and preserves earlier attendance identifiers',()=>{
 const tour=events.filter(e=>e.tourId==='zombie-crab-labo-2026');
 const dates=['02-28','03-01','03-14','03-15','03-28','03-29','04-04','04-05','04-17','04-24','04-25','05-02','05-16','05-17','06-02','06-03','06-06','06-17','06-18'];
 assert.deepEqual(tour.filter(isRecordableEvent).map(e=>e.date).sort(),dates.map(d=>'2026-'+d));
 assert.equal(tour.filter(e=>e.eventStatus==='cancelled').length,1);
 for(const id of ['2026-02-28-tokyo','2026-03-01-tokyo','2026-03-14-seoul','2026-03-15-seoul']){
  const e=events.find(x=>x.id===id),p={...emptyProfile(),attendances:[{id:`${id}@venue`,eventId:id,mode:'venue',coverage:'partial',heardEntryIds:[e.setlist[0].id],seat:'old seat',memo:'old record'}]};
  assert.deepEqual(parseBackup(JSON.stringify(exportBackup(p)),songs,events,goods),p);
 }
 assert.equal(events.find(e=>e.id==='2026-03-28-fukuoka').setlistOrderStatus,'conflicting');
 for(const id of ['2026-05-16-taipei','2026-06-06-hong-kong'])assert.equal(events.find(e=>e.id===id).setlistEvidence,'fan_single_source');
});
test('tour filtering accepts Korean aliases and cancellation cannot become attendance',()=>{
 const tourName=events.find(e=>e.tourId==='zombie-crab-labo-2026').tour;
 assert.equal(filterLiveEvents(events,{search:'좀크라'}).length,20);
 assert.equal(filterLiveEvents(events,{tour:tourName,search:'요코하마'}).length,4);
 const cancelled=events.find(e=>e.eventStatus==='cancelled'),a={id:`${cancelled.id}@venue`,eventId:cancelled.id,mode:'venue',coverage:'full',heardEntryIds:[],seat:'',memo:''},p={...emptyProfile(),attendances:[a]};
 assert.throws(()=>validateProfile(p,songs,events,goods),/관람 기록/);
 assert.equal(calculateStats(p,songs,events).attendances.length,0);
 assert.equal(calculateStats(p,songs,events).heard.length,0);
});
test('song matching accepts Korean, Japanese and romanized punctuation, but never guesses missing songs',()=>{const s=songs.find(x=>x.ja==='秒針を噛む');assert.equal(matchSong(s.ko,songs).id,s.id);assert.equal(matchSong(s.ja,songs).id,s.id);assert.equal(matchSong('Byoushin wo Kamu',songs).id,s.id);assert.equal(matchSong('not a ZUTOMAYO song',songs),null);assert.equal(validDate('2026-02-31'),false);assert.equal(validDate('2026-99-99'),false);});
