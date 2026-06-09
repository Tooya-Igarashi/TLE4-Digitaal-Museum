import mongoose from 'mongoose';

const graffitiStyleSchema = new mongoose.Schema(
    { graffitiStyleName: { type: String, required: true, trim: true, unique: true } },
    { timestamps: true }
);

export const graffitiStyles = [
    {graffitiStyleName: "Tag"},
    {graffitiStyleName: "Throw-up"},
    {graffitiStyleName: "Blockbuster"},
    {graffitiStyleName: "Wildstyle"},
    {graffitiStyleName: "Stencil"},
    {graffitiStyleName: "Realistisch"},
    {graffitiStyleName: "3D"},
    {graffitiStyleName: "Character"},
    {graffitiStyleName: "Abstract"},
    {graffitiStyleName: "Minimalistisch"},
];

export default mongoose.model('GraffitiStyle', graffitiStyleSchema);