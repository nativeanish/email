import { ario_cu, main_ario_cu } from "./constants";
import useOnboard from "../store/useOnboard";
import useAddress from "../store/useAddress";
export async function get_primary_name(address: string) {
  try {
    const result = await fetch(main_ario_cu, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(
        {
          "Id": "1234",
          "Target": "qNvAoz0TgcH7DMg8BCVn8jF32QH5L6T29VjHxhHqqGE",
          "Owner": "1234",
          "Anchor": "0",
          "Data": "1234",
          "Tags": [
            {
              "name": "Action",
              "value": "Primary-Name"
            },
            {
              "name": "Address",
              "value": address
            }
          ]
        }
      ),
    })
    const data = (await result.json()).Messages[0].Data;
    if (data === `[string ".src.main"]:5111: Primary name data not found`) {
      return false;
    }
    if (Object.keys(data).length === 0) {
      return false;
    } else {
      const js = JSON.parse(data);
      if (js.owner === address) {
        useOnboard.setState({ arns: true, arns_name: js.name, process_id: js.processId });
        return true;
      } else {
        return false;
      }
    }
  }
  catch (error) {
    console.log("There was an error fetching the primary name:");
    console.log(error);
    return false;
  }
}

export async function set_details() {
  const process_id = useOnboard.getState().process_id;
  const prom = await fetch(`${ario_cu}${process_id}`, {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      {
        "Id": "1234",
        "Target": `${process_id}`,
        "Owner": "1234",
        "Anchor": "0",
        "Data": "1234",
        "Tags": [
          {
            "name": "Action",
            "value": "State"
          },
          {
            "name": "Data-Protocol",
            "value": "ao"
          },
          {
            "name": "Type",
            "value": "Message"
          },
          {
            "name": "Variant",
            "value": "ao.TN.1"
          }
        ]
      }

    ),
  });
  const address = useAddress.getState().address;
  const response = JSON.parse((await prom.json()).Messages[0].Data);
  console.log(response);
  if (response.Owner === address) {
    useOnboard.setState({ name: response.Name, bio: response.Description, image: `https://arweave.net/${response.Logo}`, image_type: "url" });
  }
  return true;
}
