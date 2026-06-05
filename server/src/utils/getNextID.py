from src.models.Counter import Counter

PREFIX = {
  "admin": "ADM",
  "staff": "STF",
  "member": "MBR",
  "events": "EVT",
  "trainer": "TRN",
  "diet_plan": "DPL",
  "member_plan": "MPN",
  "transaction": "PTR",
  "workout_plan": "WPL",
  "member_payment": "MPY",
  "trainer_salary": "TSL",
  "membership_plan": "MPL",
}

async def getNextID(collection_name: str) -> str:
    prefix = PREFIX[collection_name]
    counter = await Counter.get(collection_name)
    if counter:
        counter.seq += 1
        await counter.replace()
    else:
        counter = Counter(id=collection_name, seq=1)
        await counter.insert()
    return f"{prefix}-{counter.seq:03d}"