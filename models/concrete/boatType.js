const mongoose = require("mongoose");
const projectBaseModel = require("../projectBaseModel.js");

const boatTypeSchema = new mongoose.Schema({
  typeCode: {
    type: Number,
    unique: [true, 'Type code should be unique.'],
  },
  typeName: {
    type: String,
    required: [true, 'Type name should be declared.']
  },
  ...projectBaseModel
},{timestamps: true});

boatTypeSchema.index({ typeCode: 1 }, {unique: true});

boatTypeSchema.pre('save', async function (next) {
    if (!this.typeCode) {
        const lastBoatType = await this.constructor.findOne({}, { typeCode: 1 }, { sort: { typeCode: -1 } });

        if (lastBoatType) {
            this.typeCode = lastBoatType.typeCode +1;
        } else {
            this.typeCode = 1;
        }
    }
    next();
});

const boatType = mongoose.model('boatType', boatTypeSchema);

module.exports = boatType;