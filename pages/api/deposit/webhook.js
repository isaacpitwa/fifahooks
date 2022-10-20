import formidable from 'formidable';

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
    const { address,amount,type }  = data;
    console.log("Webhook received!");
    console.log("Wallet address: ",address);
    console.log ("Amount: ", amount);
    console.log("Type: ",type);
    res.status(200).json(data);
}