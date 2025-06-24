import { dryrun } from "@permaweb/aoconnect";
import { arns, process } from "./constants";

export async function check_user(address: string) {
  try {
    const resul = await dryrun({
      process: process,
      tags: [
        {
          name: "Action",
          value: "Evaluate",
        },
        { name: "getByAddress", value: address },
      ],
    });
    const msg = JSON.parse(resul.Messages[0].Data) as {
      status: 0 | 1;
      data: string;
    };
    console.log("check_user result:", msg);
    return msg;
  } catch (e) {
    console.error("Error in check_user:", e);
    return undefined;
  }
}
export const get_primary_name = async (address: string) => {
  const resul = await dryrun({
    process: arns,
    tags: [
      {
        name: "Action",
        value: "Primary-Name",
      },
      { name: "Address", value: address },
    ],
  });
  console.log(resul);
};
