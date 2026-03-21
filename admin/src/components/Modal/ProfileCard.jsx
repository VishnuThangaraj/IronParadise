import Modal from "@mui/joy/Modal";
import ModalDialog from "@mui/joy/ModalDialog";
import DialogContent from "@mui/joy/DialogContent";
import DialogActions from "@mui/joy/DialogActions";

import Card from "@mui/joy/Card";
import AspectRatio from "@mui/joy/AspectRatio";
import Typography from "@mui/joy/Typography";
import Chip from "@mui/joy/Chip";
import Stack from "@mui/joy/Stack";
import Button from "@mui/joy/Button";
import Divider from "@mui/joy/Divider";
import Box from "@mui/joy/Box";

import ButtonSubmit from "@/components/Button/ButtonSubmit.jsx"

import ProfileImage from "../../../public/images/admin_image.webp";
import {userEmail, userName} from "@/config/UserConfig"

const ProfileCard = ({open, setOpen}) => {
    return (
        <Modal open={open} onClose={() => setOpen(false)}>
            <ModalDialog
                variant="outlined"
                sx={{
                    maxWidth: 420,
                    borderRadius: "lg",
                    boxShadow: "lg",
                }}
            >
                <DialogContent>
                    <Card
                        variant="soft"
                        sx={{
                            borderRadius: "lg",
                            p: 2,
                            gap: 2,
                        }}
                    >
                        {/* Top Section */}
                        <Stack direction="row" spacing={2} alignItems="center">
                            <AspectRatio
                                ratio="1"
                                sx={{
                                    width: 90,
                                    borderRadius: "50%",
                                    overflow: "hidden",
                                    border: "2px solid",
                                    borderColor: "primary.softColor",
                                }}
                            >
                                <img src={ProfileImage} alt="Profile"/>
                            </AspectRatio>

                            <Box>
                                <Typography level="title-lg">
                                    {userName}
                                </Typography>

                                <Typography level="body-sm" color="primary">
                                    Software Developer • Data Science
                                </Typography>

                                <Typography level="body-xs" sx={{mt: 0.5}}>
                                    Fresher • Open to work
                                </Typography>
                            </Box>
                        </Stack>

                        {/* Bio */}
                        <Typography level="body-sm">
                            Software developer with a strong foundation in data science.
                            Skilled in building web applications and integrating data-driven
                            solutions using machine learning and analytics.
                        </Typography>

                        {/* Skills */}
                        <Stack direction="row" spacing={1} flexWrap="wrap">
                            <Chip size="sm" variant="soft" color="primary">MERN</Chip>
                            <Chip size="sm" variant="soft">Java</Chip>
                            <Chip size="sm" variant="soft">SpringBoot</Chip>
                            <Chip size="sm" variant="soft">Python</Chip>
                            <Chip size="sm" variant="soft">ML</Chip>
                            <Chip size="sm" variant="soft">SQL</Chip>
                        </Stack>

                        <Divider/>

                        {/* Education + Strength */}
                        <Stack spacing={1}>
                            <Box>
                                <Typography level="body-xs" color="neutral">
                                    Education
                                </Typography>
                                <Typography level="title-sm">
                                    MSc Data Science
                                </Typography>
                            </Box>

                            <Box>
                                <Typography level="body-xs" color="neutral">
                                    Strength
                                </Typography>
                                <Typography level="title-sm">
                                    Full Stack + Data-Driven Development
                                </Typography>
                            </Box>
                        </Stack>
                    </Card>
                </DialogContent>

                {/* Actions */}
                <DialogActions sx={{justifyContent: "space-between"}}>
                    <div className="flex gap-4">
                        <Button
                            variant="outlined"
                            color="neutral"
                            onClick={() => window.location.href = `mailto:${userEmail}`}
                        ><i className="fa-duotone fa-thin fa-envelope me-2"></i>
                            Contact Me
                        </Button>
                        <ButtonSubmit
                        ><i className="fa-light fa-download me-2"></i>
                            Resume
                        </ButtonSubmit>
                    </div>
                </DialogActions>
            </ModalDialog>
        </Modal>
    );
};

export default ProfileCard;