import formidable from 'formidable';
import { db } from '../../../lib/db';

export const config = {
    api: {
      bodyParser: false
    }
}
export default  async (req, res) =>{
    const data = await new Promise((resolve, reject) => {
        const form = new formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
          if (err) reject({ err })
          resolve({ err, fields, files })
        }) 
      })
    const { address,amount,type }  = data.fields;
    console.log("Webhook received!");
    console.log("Wallet address: ",address);
    console.log ("Amount: ", amount);
    console.log("Type: ",type);

    const wallet = await db.exec('select id from wallets where address = ?', [address]);
    console.log("Wallet id: ",wallet.rows[0].id);
    const deposit = db.exec('select id, user_id from deposits where wallet_address = ? and status = 2', [wallet.rows[0].id]);
    res.status(200).json(deposit.rows[0]);
}