import Grid from "@mui/material/Grid2";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/joy";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div
      id="authform"
      style={{ background: `url("images/loginBg.jpg") center no-repeat` }}
      className="flex items-center justify-center h-screen bg-cover"
    >
      <div
        className="flex flex-col gap-7 items-center"
        style={{ width: "90%", maxWidth: "600px" }}
      >
        <img
          src="images/logoBlack.png"
          alt="Iron Paradise"
          className="w-30 sm:w-40"
        />
        <Grid
          sx={{ p: 5, py: 4, borderRadius: 3 }}
          className="bg-white w-full shadow-md"
          component="form"
        >
          {/* Welcome Message */}
          <div className="font-bold text-2xl pb-1 text-center">
            Welcome to Iron Paradise
          </div>
          <div
            className="text-gray-500 text-center pt-4"
            style={{ letterSpacing: "1px", textAlign: "justify" }}
          >
            Your journey to fitness starts here! At Iron Paradise, we provide
            top-notch equipment, professional trainers, and a supportive
            community to help you crush your goals.
          </div>

          {/* Contact Options */}
          <div className="flex flex-wrap justify-center my-5 gap-5">
            <div className="border-2 border-gray-200 w-28 sm:w-1/4 p-2 rounded-xl">
              <div className="text-center">
                <i className="fa-duotone fa-light fa-phone-volume text-3xl"></i>
              </div>
              <a href="tel:8062208268">
                <div className="hover:underline cursor-pointer text-center mt-2">
                  Phone
                </div>
              </a>
            </div>
            <div className="border-2 border-gray-200 w-28 sm:w-1/4 p-2 rounded-xl">
              <div className="text-center">
                <i className="fa-duotone fa-light fa-envelopes text-3xl"></i>
              </div>
              <a href="mailto:info@ironparadise.com">
                <div className="hover:underline cursor-pointer text-center mt-2">
                  Email
                </div>
              </a>
            </div>
            <div className="border-2 border-gray-200 w-28 sm:w-1/4 p-2 rounded-xl">
              <div className="text-center">
                <i className="fa-duotone fa-light fa-location-dot text-3xl"></i>
              </div>
              <a
                href="https://maps.app.goo.gl/Ls7wuRntadwWaUP5A"
                target="_blank"
              >
                <div className="hover:underline cursor-pointer text-center mt-2">
                  Address
                </div>
              </a>
            </div>
          </div>

          {/* Additional Info */}
          <div className="text-gray-600 text-sm pb-5 text-center">
            Whether you&apos;re a beginner or a seasoned athlete, we have
            something for everyone. Join us today and transform your health, one
            rep at a time.
          </div>

          {/* Call to Action */}
          <div className="text-center">
            <Button
              className="transition-all duration-300 w-full sm:w-auto"
              variant="solid"
              type="submit"
              size="md"
              sx={{
                px: 4,
                py: 2,
                backgroundColor: "black",
                "&:hover": {
                  backgroundColor: "#222222",
                },
              }}
              onClick={() => navigate("/enquiry")}
            >
              <i className="fa-regular fa-messages me-3"></i>
              Connect With Us
            </Button>
          </div>
        </Grid>
      </div>
    </div>
  );
};

export default Home;
