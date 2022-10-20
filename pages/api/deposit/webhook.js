export default function handler(req, res) {
    const { address,amount,type} = JSON.parse(req.body);
    console.log("Webhook received!");
    console.log("Wallet address: ",address);
    console.log ("Amount: ", amount);
    console.log("Type: ",type);
    res.status(200).json(req.body);
}