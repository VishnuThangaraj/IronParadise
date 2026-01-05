import { useNavigate } from "react-router-dom";
import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { Card, Button, CardContent } from "@mui/joy";

import { MemberColumns } from "./MemberColumns";
import { PageLocation } from "../../components/PageLocation";
import DataTable from "../../components/DataTable/DataTable";
import SearchBar from "../../components/DataTable/SearchBar";
import ExportButtons from "../../components/DataTable/ExportButtons";

import { fetchAllMembers } from "../../redux/member/memberThunks";
import { selectAllMembers } from "../../redux/member/memberSelector";

const MembersList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const members = useSelector(selectAllMembers);

  useEffect(() => {
    dispatch(fetchAllMembers());
  }, [dispatch]);

  const filteredRows = useMemo(() => {
    const query = search.toLowerCase();

    return members.filter(
      (row) =>
        row.memberId?.toString().toLowerCase().includes(query) ||
        row.name?.toLowerCase().includes(query) ||
        row.email?.toLowerCase().includes(query) ||
        row.mobile?.includes(query)
    );
  }, [members, search]);

  return <div>MembersList</div>;
};

export default MembersList;
