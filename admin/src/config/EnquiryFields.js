export const initialEnquiryState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

export const dropdownOptions = {
  gender: ["Male", "Female", "Other"],
};

export const EnquiryFieldGroup = [
  {
    title: "Enter Your Name",
    fields: [
      {
        label: "First Name",
        name: "firstName",
        placeholder: "First Name",
        size: 50,
      },
      {
        label: "Last Name",
        name: "lastName",
        placeholder: "Last Name",
        size: 50,
      },
    ],
  },
  {
    title: "Enter your Contact Details",
    fields: [
      {
        label: "Email",
        name: "email",
        type: "email",
        placeholder: "example@gmail.com",
        size: 50,
      },
      {
        label: "Contact Number",
        name: "phone",
        placeholder: "0000 0000 00",
        mobile: true,
        size: 50,
      },
    ],
  },
  {
    title: "Subject",
    fields: [
      {
        label: "Subject",
        name: "subject",
        placeholder: "Subject",
        size: 100,
      },
    ],
  },
  {
    title: "Message",
    fields: [
      {
        label: "Message",
        name: "subject",
        type: "textbox",
        placeholder: "Enter Your Message...",
        size: 100,
        rows: 4,
      },
    ],
  },
];
