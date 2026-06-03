import os
import json
from fastapi import HTTPException, status
from pymongo.errors import DuplicateKeyError

from src.models.Member import Member
from src.schemas.memberSchemas import MemberRequest

#Create new Member
async def create_member(data: MemberRequest):
    existing_member = await Member.find_one(
        Member.email == data.email,
        Member.mobile == data.mobile
    )

    if existing_member:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Member with this email or mobile already exists",
        )

    try:
        newMember = Member(**data.model_dump())
        await newMember.insert()

        return {
            "message": "Member created successfully",
            "member": newMember
        }   

    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Member with this email or mobile already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create member: {str(e)}",
        )

#Fetch all Members
async def fetch_all_members():
    try:
        members = await Member.find().to_list(length=None)
        return members
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail='Failed to retrieve Members'
        )

#Fetch single Member
async def fetch_member_by_id(id:str):
    member = await Member.find_one(Member.memberId == id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Member not found'
        )   

    return member

#Update Member
async def update_member(id: str, data: MemberRequest):
    member = await Member.find_one(Member.memberId == id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail='Member not found'
        )
    
    if data.email != member.email or data.mobile != member.mobile:
        existing_member = await Member.find_one(
            (Member.email == data.email) | (Member.mobile == data.mobile)
        )
        # Verify it's not the current member
        if existing_member and existing_member.memberId != id:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Member with this email or mobile already exists",
            )
            
    update_data = data.model_dump(exclude_unset=False)
    for key, value in update_data.items():
        setattr(member, key, value)
        
    try:
        await member.save()
        return {
            "message": "Member updated successfully",
            "member": member
        }
    except DuplicateKeyError:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Member with this email or mobile already exists",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update member: {str(e)}",
        )

#Delete Member
async def delete_member(id: str):
    member = await Member.find_one(Member.memberId == id)
    if not member:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Member not found",
        )
        
    try:
        await member.delete()
        return {
            "message": "Member deleted successfully"
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete member: {str(e)}",
        )

#Populate Member
async def populate_member():    
    file_path = os.path.join(os.path.dirname(__file__), "..", "data", "member.json")
    with open(file_path, "r") as f:
        members = json.load(f)

    for member_data in members:
        existing_member = await Member.find_one(Member.email == member_data["email"])
        if existing_member:
            continue
            
        newMember = Member(**member_data)
        await newMember.insert()

    return {
        "message": "Members populated successfully"
    }
