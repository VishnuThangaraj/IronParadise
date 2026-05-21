from src.models.Counter import Counter

PREFIX = {
  "diet": "DPL",
  "admin": "ADM",
  "staff": "STF",
  "member": "MBR",
  "workout": "WPL",
  "trainer": "TRN",
  "transaction": "PTR",
  "membershipplan": "MPL",
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