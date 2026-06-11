import mongoose from 'mongoose';

const locationSchema = new mongoose.Schema(
    { regionName: { type: String, required: true, trim: true } },
    { timestamps: true }
);

export const locations = [
    {regionName: "Nieuwerkerk aan den IJssel"},
    {regionName: "Rotterdam"},
    {regionName: "Den Haag"},
    {regionName: "Katwijk"},
    {regionName: "Capelle aan den IJssel"},
    {regionName: "Leiden"},
    {regionName: "Alphen aan de Rijn"},
    {regionName: "Waddinxveen"},
    {regionName: "Zoetemeer"},
    {regionName: "Maassluis"},
    {regionName: "Spijkernisse"},
    {regionName: "Dordrecht"},
];

export default mongoose.model('Location', locationSchema);