from typing import Optional, List
from pydantic import BaseModel, Field, ConfigDict

class DepartmentBase(BaseModel):
    tpCd: str = Field(..., description="Department Type Code")
    tpNm: str = Field(..., description="Department Name")
    descCntn: Optional[str] = Field("", description="Description")
    useYn: str = Field("Y", description="Active status Y/N")

class DepartmentResponse(DepartmentBase):
    Key: str
    rowKey: int
    createdAt: str

    model_config = ConfigDict(from_attributes=True)

class CalendarEventCreate(BaseModel):
    date_id: int
    time: str
    description: str
    event_id: Optional[str] = None

class WmsItemCreate(BaseModel):
    title: str
    quantity: int
    isbn: Optional[str] = None
    date: Optional[str] = None
