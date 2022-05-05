process.env.PORT = process.env.PORT || 3000;

let urlDB;

if(process.env.NODE_ENV=== 'dev'){
    urlDB = "mongodb+srv://rfelix2022:Ramon06121971@cluster0.faaap.mongodb.net/handCloudBootCam?retryWrites=true&w=majority";//"mongodb://localhost:27017/TiposDeDatos"
}else{
    urlDB = "mongodb+srv://rfelix2022:Ramon06121971@cluster0.faaap.mongodb.net/handCloudBootCam?retryWrites=true&w=majority"
}

process.env.URLDB = urlDB;

process.env.SEED = process.env.SEED || 'Firma-secreta';

process.env.CADUCIDAD_TOKEN = process.env.CADUCIDAD_TOKEN || '8h';