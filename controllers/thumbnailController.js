const Thumbnail = require("../models/thumbnail.js");
const path = require("path");
const fs = require("fs");
const { pipeline } = require("stream");
const util = require("util");
const { default: fastify } = require("fastify");
const pipelineAsync = util.promisify(pipeline);

exports.createThumbnail = async (request, reply) => {
  try {
    const parts = request.part();
    let fields = {};
    let filename;

    for await (const part of parts) {
      if (part.file) {
        const filename = `${Date.now()}-${part.filename}`;
        const saveTo = path.join(
          __dirname,
          "..",
          "uploads",
          "thumbnails",
          filename
        );
        await pipelineAsync(part.file, fs.createWriteStream(saveTo));
      } else {
        fields[part.filename] = part.value;
      }
    }

    const thumbnail = new Thumbnail({
      user: request.user.id,
      videoName: fields.videoName,
      version: fields.version,
      image: `/uploads/thumbnails/${filename}`,
      paid: fields.paid === "true",
    });

    await thumbnail.save();
    reply.code(201).send(thumbnail);
  } catch (error) {
    reply.send(error);
  }
};

exports.getThumbnails = async (request, reply) => {
  try {
    const thumbnails = await Thumbnail.find({ user: request.user.id });
    reply.send(thumbnails);
  } catch (error) {
    reply.send(error);
  }
};

exports.getThumbnail = async (request, reply) => {
  try {
    //validate it first
    const thumbnail = await Thumbnail.findOne({
      _id: request.params.id,
      user: request.user.id,
    });
    if (!thumbnail) {
      return reply.notFound("Thumbnail not found");
    }
    reply.send(thumbnail);
  } catch (error) {
    reply.send(error);
  }
};

exports.updateThumbnail = async (request, reply) => {
  try {
    const updateDate = request.body;
    const thumbnail = await Thumbnail.findByIdAndUpdate(
      { _id: request.params.id, user: request.user.id },
      updateDate,
      { new: true }
    );
    if (!thumbnail) {
      return reply.notFound("Thumbnail not found");
    }
    reply.send(thumbnail);
  } catch (error) {
    reply.send(error);
  }
};

exports.deleteThumbnail = async (request, reply) => {
  try {
    const thumbnail = await Thumbnail.findByIdAndDelete({
      _id: request.params.id,
      user: request.user.id,
    });

    if (!thumbnail) {
      return reply.notFound("Thumbnail not found");
    }
    const filepath = path.join(
      __dirname,
      "..",
      "uploads",
      "thumbnails",
      path.basename(thumbnail.image)
    );

    fs.unlink(filepath, (err) => {
      if (err) fastify.log.error(err);
    });

    reply.send({ message: "Thumbnail deleted" });
  } catch (error) {
    reply.send(error);
  }
};

exports.deleteAllThumbnail = async (request, reply) => {
  try {
    const thumbnails = await Thumbnail.find({ user: request.user.id });

    await Thumbnail.deleteMany({ user: request.user.id });

    for (const thumbnail of thumbnails) {
      const filepath = path.join(
        __dirname,
        "..",
        "uploads",
        "thumbnails",
        path.basename(thumbnail.image)
      );

      fs.unlink(filepath, (err) => {
        if (err) fastify.log.error(err);
      });
    }

    reply.send({message:"All thubnails deleted"})
  } catch (error) {
    reply.send(error);
  }
};
