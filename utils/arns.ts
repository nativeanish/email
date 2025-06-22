import { ario_cu, main_ario_cu } from "./constants";
import useOnboard from "../store/useOnboard";
import useAddress from "../store/useAddress";
import { showDanger } from "../Components/UI/Toast/Toast-Context";
export async function get_wallet_ario(address: string) {
  try {
    const result = await fetch(main_ario_cu, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: "1234",
        Target: "qNvAoz0TgcH7DMg8BCVn8jF32QH5L6T29VjHxhHqqGE",
        Owner: "1234",
        Anchor: "0",
        Data: "1234",
        Tags: [
          {
            name: "Action",
            value: "Primary-Name",
          },
          {
            name: "Address",
            value: address,
          },
        ],
      }),
    });
    const data = (await result.json()).Messages[0].Data;
    if (
      data === `[string ".src.main"]:5111: Primary name data not found` ||
      Object.keys(data).length === 0
    ) {
      return false;
    }
    const js = JSON.parse(data);
    if (js.owner === address) {
      useOnboard.setState({
        arns: true,
        arns_name: js.name,
        process_id: js.processId,
      });
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error("Error fetching wallet ARIO:", error);
    showDanger(
      "Error in ARIO data",
      "Failed to fetch ARIO data. Please try again later.",
      6000
    );
    return undefined;
  }
}
export async function set_details(process_id: string) {
  try {
    const prom = await fetch(`${ario_cu}${process_id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Id: "1234",
        Target: `${process_id}`,
        Owner: "1234",
        Anchor: "0",
        Data: "1234",
        Tags: [
          {
            name: "Action",
            value: "State",
          },
          {
            name: "Data-Protocol",
            value: "ao",
          },
          {
            name: "Type",
            value: "Message",
          },
          {
            name: "Variant",
            value: "ao.TN.1",
          },
        ],
      }),
    });
    const response = JSON.parse((await prom.json()).Messages[0].Data);
    if (response.Owner !== useAddress.getState().address) {
      showDanger(
        "Error in ARIO data",
        "You are not the owner of this ARIO process.",
        6000
      );
      return false;
    }
    console.log(response);
    if ((response.Logo, response.Name, response.Description)) {
      useOnboard.setState({
        arns: true,
        arns_name: response.Name,
        bio: response.Description,
        image: response.Logo,
        image_type: "url",
      });
      return true;
    }
    return false;
  } catch (error) {
    console.error("Error setting details:", error);
    showDanger(
      "Error in ARIO data",
      "Failed to set ARIO details. Please try again later.",
      6000
    );
    return false;
  }
}
