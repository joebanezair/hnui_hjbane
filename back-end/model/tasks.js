const mongoose = require("mongoose");

// Define Task schema
const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150
    },
    description: {
      type: String,
      trim: true
    },
    // dueDate: {
    //   type: Date,
    //   validate: {
    //     validator: (v) => !v || v > Date.now(),
    //     message: "Due date must be in the future"
    //   }
    // },
    // status: {
    //   type: String,
    //   enum: ["pending", "in-progress", "completed"],
    //   default: "pending"
    // },
    files: [
      {
        type: String,
        validate: {
          validator: (v) => !/\.(exe|msi|bat|cmd|sh|apk|deb|rpm|pkg)$/i.test(v),
          message: "Executable or installable files are not allowed"
        }
      }
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

// Export model
const PostTasks = mongoose.model("PostedTask", taskSchema);
module.exports = PostTasks;
