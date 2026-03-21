import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";

import PageLocation from "../../components/PageLocation";

import KPICards from "../../components/Dashboard/KPICards";
import AddMemberCard from "../../components/Dashboard/AddMemberCard";
import NewMembersCard from "../../components/Dashboard/NewMembersCard";

import {AdminDashboardKPIItems} from "../../config/AdminDashboardItems";

import {fetchAllMembers} from "../../redux/member/memberThunks";
import {selectAllMembers} from "../../redux/member/memberSelector";

import {fetchAllTrainers} from "../../redux/trainer/trainerThunks";
import {selectAllTrainers} from "../../redux/trainer/trainerSelectors";
import NewTrainersCard from "../../components/Dashboard/NewTrainersCard";

const AdminDashborard = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const members = useSelector(selectAllMembers);
    const trainers = useSelector(selectAllTrainers);

    useEffect(() => {
        dispatch(fetchAllMembers());
        dispatch(fetchAllTrainers());
    }, [dispatch]);

    return (
        <div className="">
            <PageLocation
                pageTitle="Gym Management"
                parentPath="Dashboard"
                currentPath="Gym-Management"
            />
            {/* KPI Cards */}
            <div className="flex flex-row justify-evenly gap-6 mt-5">
                <div className="w-9/12 flex flex-col gap-7">
                    <div className="flex justify-between gap-5">
                        {AdminDashboardKPIItems.map((kpi, index) => (
                            <KPICards
                                key={`admin-kpi-${index}`}
                                title={kpi.title}
                                data={kpi.data}
                                border={kpi.border}
                                icon={kpi.icon}
                                bg={kpi.bg}
                            />
                        ))}
                    </div>
                    <NewTrainersCard trainers={trainers.slice(-5).reverse()}/>
                </div>
                <div className="flex flex-col gap-7 w-3/12">
                    <AddMemberCard navigate={navigate}/>
                    <NewMembersCard members={members.slice(-5).reverse()}/>
                </div>
            </div>
        </div>
    );
};

export default AdminDashborard;
