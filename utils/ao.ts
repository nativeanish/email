import { dryrun, } from "@permaweb/aoconnect";
import useAddress from "../store/useAddress";
import { process } from "./constants";

export async function check_user() {
    const address = useAddress.getState().address
    if (address) {
        const resul = await dryrun({
            process: process,
            tags: [{
                name: "Action",
                value: "Evaluate"
            }, { name: "getByAddress", value: address }]
        })
        const msg = JSON.parse(resul.Messages[0].Data) as { status: 0 | 1, data: string }
        if (msg.status === 0 && msg.data === "User not found: " + address) {
            localStorage.setItem("user", "undefined");
            return false;
        }
        if (msg.status === 1) {
            const user = JSON.parse(msg.data);
            if (user && typeof user === 'object' && 'address' in user && "username" in user && "image" in user) {
                localStorage.setItem("user", JSON.stringify(user));
                return true;
            }
        }
        localStorage.setItem("user", JSON.stringify({ user: undefined }));
        return false;
    }
}