require("dotenv").config();
const bcrypt = require("bcrypt");
const { Schema, model } = require("mongoose");
const getNextId = require("../utils/getNextId");

const UserSchema = new Schema(
  {
    userId: {
      type: String,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 50,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Invalid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },

    role: {
      type: String,
      enum: ["admin", "trainer"],
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[0-9]{10}$/, "Invalid phone"],
      required: function () {
        return this.role === "trainer";
      },
    },

    dob: {
      type: Date,
      required: function () {
        return this.role === "trainer";
      },
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: function () {
        return this.role === "trainer";
      },
    },

    height: {
      type: Number,
      min: 0,
      required: function () {
        return this.role === "trainer";
      },
    },

    weight: {
      type: Number,
      min: 0,
      required: function () {
        return this.role === "trainer";
      },
    },

    bmi: {
      type: Number,
      min: 0,
    },

    specialization: {
      type: String,
      trim: true,
      maxlength: 100,
      required: function () {
        return this.role === "trainer";
      },
    },

    experienceYears: {
      type: Number,
      min: 0,
      max: 50,
      required: function () {
        return this.role === "trainer";
      },
    },

    monthlySalary: {
      type: Number,
      min: 0,
      required: function () {
        return this.role === "trainer";
      },
    },

    aadharNumber: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[0-9]{12}$/, "Invalid Aadhar"],
      required: function () {
        return this.role === "trainer";
      },
    },

    panNumber: {
      type: String,
      uppercase: true,
      trim: true,
      unique: true,
      sparse: true,
      match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN"],
      required: function () {
        return this.role === "trainer";
      },
    },

    address: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    joiningDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

UserSchema.pre("save", async function () {
  const promises = [];

  if (this.isNew) {
    promises.push(
      getNextId(this.role).then((id) => {
        this.userId = id;
      })
    );
  }

  if (this.isModified("password")) {
    promises.push(
      bcrypt.hash(this.password, Number(process.env.SALT_ROUNDS)).then((hash) => {
        this.password = hash;
      })
    );
  }

  await Promise.all(promises);
});

UserSchema.methods.toJSON = function () {
  const obj = this.toObject();

  if (obj.role === "admin") {
    const fieldsToRemove = [
      "phone",
      "dob",
      "gender",
      "height",
      "weight",
      "bmi",
      "specialization",
      "experienceYears",
      "monthlySalary",
      "aadharNumber",
      "panNumber",
      "address",
      "joiningDate",
    ];
    for (const field of fieldsToRemove) {
      delete obj[field];
    }
  }

  return obj;
};

module.exports = model("User", UserSchema);
