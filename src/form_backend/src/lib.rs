use ic_cdk::{
    api::{caller},
    export::{
        candid::{candid_method, CandidType, Deserialize},
        Principal,
    },
};
use ic_cdk_macros::*;
use std::cell::RefCell;
use std::collections::{HashSet, HashMap};

type FormKv = HashMap<u64, FormRecord>;

#[derive(Clone, Debug, PartialEq, Eq, Hash, CandidType, Deserialize)]
struct FormRecord {
    pub app_principal: Option<Principal>,
    pub app_account: Option<String>,
    pub nns_principal: Principal,
}

#[derive(Default)]
struct State {
    pub form_kv: FormKv,
    pub id: u64,
    pub readers: HashSet<Principal>,
    pub owner: Option<Principal>,
}

impl State {
    fn next_id(&mut self) -> u64 {
        let id = self.id;
        self.id += 1;
        id
    }
    
    pub fn get_all_records(&self) -> Vec<FormRecord> {
        self.form_kv
            .iter()
            .map(|(_, o)| o.clone())
            .collect()
    }
}

thread_local! {
    static STATE: RefCell<State> = RefCell::new(State::default());
}

#[init]
fn init() {
    STATE.with(|s| {
        let mut s = s.borrow_mut();
        s.readers = HashSet::from_iter([caller()]);
        s.owner = Some(caller());
    });
}

#[post_upgrade]
fn post_upgrade() {
    STATE.with(|s| {
        let mut s = s.borrow_mut();
        s.readers = HashSet::from_iter([caller()]);
        s.owner = Some(caller());
    });
}


#[query(name = "getAll")]
#[candid_method(query, rename = "getAll")]
fn get_all() -> Vec<FormRecord> {
    
    STATE.with(|s| {
    	let s = s.borrow();
        if s.readers.contains(&caller()) {
            s.get_all_records()
        }
        else {
            Vec::new()
        }
        })    
}

#[update]
fn create(form_record: FormRecord) -> Result<u64, AppErr> {
    STATE.with(|s| {
        let mut s = s.borrow_mut();
        let curr_id = s.id;
    	s.form_kv
        .insert(curr_id, form_record);
        Ok(s.next_id())
    })
}

#[update]
fn add_reader(reader: Principal) {
    STATE.with(|s| {
        let mut s = s.borrow_mut();
        if Some(caller()) != s.owner {  ic_cdk::trap("Unauthenticated"); }
        if s.readers.contains(&caller()) {
    	    s.readers
            .insert(reader);
        }
    });
}

#[derive(CandidType)]
pub enum AppErr {
    Unauthenticated,
    Other,
}

