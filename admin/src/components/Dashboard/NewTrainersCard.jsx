import { Card, CardContent, Button, Table, Divider, Box } from "@mui/joy";

const NewTrainersCard = ({ trainers }) => {
  return (
    <div key="NewTrainersCard">
      <Card className="shadow-md" sx={{ p: 3, backgroundColor: "white" }}>
        <CardContent>
          <div className="font-semibold text-lg">Recently Added Trainers</div>
          <Divider />
          <Box
            sx={{
              maxHeight: "310px",
              overflowY: "auto",
              mt: 2,
            }}
          >
            <Table
              sx={{
                "& td": { padding: "5px" },
                "& tr > *:not(:first-child)": { textAlign: "center" },
              }}
            >
              <thead>
                <tr>
                  <th style={{ textAlign: "center" }}>ID</th>
                  <th style={{ textAlign: "center" }}>Name</th>
                  <th style={{ textAlign: "center" }}>Contact</th>
                  <th style={{ textAlign: "center" }}>Gender</th>
                  <th style={{ textAlign: "center" }}>Specialization</th>
                </tr>
              </thead>
              <tbody>
                {trainers.slice(-5).map((trainer, index) => (
                  <tr key={`trainer-dash-${index}`}>
                    <td style={{ textAlign: "center" }}>
                      {trainer.userId.toUpperCase()}
                    </td>
                    <td style={{ textAlign: "center" }}>{trainer.name}</td>
                    <td style={{ textAlign: "center" }}>{trainer.phone}</td>
                    <td style={{ textAlign: "center" }}>
                      {trainer.gender.toUpperCase()}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {trainer.specialization}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
};

export default NewTrainersCard;
