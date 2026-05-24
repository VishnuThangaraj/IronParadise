from src.models.Counter import Counter

PREFIX = {
  "diet_plan": "DPL",
  "admin": "ADM",
  "staff": "STF",
  "member": "MBR",
  "workout_plan": "WPL",
  "trainer": "TRN",
  "transaction": "PTR",
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