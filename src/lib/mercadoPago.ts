import "server-only";
import MercadoPago, {Payment} from 'mercadopago';
if(!process.env.MERCADO_PAGO_ACCESS_TOKEN){
    throw new Error("MERCADO_PAGO_ACCESS_TOKEN not set")
}

const mercadoPago= new MercadoPago({accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN});
export default mercadoPago;
