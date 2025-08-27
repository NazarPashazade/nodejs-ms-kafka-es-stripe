import axios from "axios";
import { AUTH_BASE_URL, ORDER_BASE_URL } from "../../config";
import { InProcessOrder } from "../../dto/order.model";
import { User } from "../../dto/user.model";
import { APIError, AuthorizeError } from "../error";
import { logger } from "../logger";

export const getOrderDetails = async (
  orderNumber: number,
  token: string
): Promise<InProcessOrder> => {
  try {
    axios.defaults.headers.common["Authorization"] = token;

    const url = `${ORDER_BASE_URL}/${orderNumber}/checkout`;
    const { data } = await axios.get(url);

    return data as InProcessOrder;
  } catch (err) {
    logger.error(err);
    throw new APIError("Failed to fetch order details");
  }
};

export const validateUser = async (token: string) => {
  try {
    const headerOption = { headers: { Authorization: token } };

    const { data, status } = await axios.get(
      `${AUTH_BASE_URL}/validate`,
      headerOption
    );

    if (status != 200) throw new AuthorizeError("The user is not authorized");

    return data as User;
  } catch (err) {
    logger.error(err);
    throw new AuthorizeError("General: The user is not authorized");
  }
};
