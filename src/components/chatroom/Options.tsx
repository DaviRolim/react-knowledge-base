import { CopyIcon, PhoneIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  FormLabel,
  IconButton,
  Input,
  Text,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { SocketContext } from "../../context/SocketContext";

const Options = ({ children }: React.PropsWithChildren) => {
  const { me, callAccepted, name, setName, callEnded, leaveCall, callUser } =
    useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <Flex justifyContent="center" alignContent="center">
      <Box className="grid w-[80%] grid-cols-2 gap-x-4  rounded-lg bg-slate-100 p-6">
        <form autoComplete="off">
          <div className="col-span-2  md:col-span-1">
            <Text className="mb-2 text-xl">Account Info</Text>
            <FormLabel htmlFor="name">Name</FormLabel>
            <Input
              className="w-full"
              variant="flushed"
              value={name}
              onChange={(e) => setName!(e.target.value)}
            />
            <CopyToClipboard text={me!}>
              <Button
                bg="blue.200"
                className="mt-4 w-full"
                rightIcon={<CopyIcon />}
                aria-label="copy"
              >
                Copy Your ID
              </Button>
            </CopyToClipboard>
          </div>
        </form>

        <div className="col-span-2 md:col-span-1">
          <Text className="mb-2 text-xl">Make a call</Text>
          <FormLabel htmlFor="name">ID to Call</FormLabel>
          <Input
            className="w-full"
            variant="flushed"
            value={idToCall}
            onChange={(e) => setIdToCall!(e.target.value)}
          />
          {callAccepted && !callEnded ? (
            <Button
              variant="outline"
              className="bg-red mt-4 w-full"
              onClick={() => leaveCall!()}
              leftIcon={<PhoneIcon />}
            >
              Hang Up
            </Button>
          ) : (
            <Button
              bg="blue.200"
              leftIcon={<PhoneIcon />}
              className="mt-4 w-full"
              onClick={() => callUser!(idToCall)}
              aria-label="copy"
            >
              Call
            </Button>
          )}
        </div>
        {children}
      </Box>
    </Flex>
  );
};

export default Options;
