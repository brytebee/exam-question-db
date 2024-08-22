import { styled } from "@mui/system";

const Overlay = styled("div")({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
});

const SpinnerWrapper = styled("div")({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
});

const SpinnerAnimation = styled("div")({
  width: "50px",
  height: "50px",
  border: "5px solid rgba(255, 191, 0, 0.3)",
  borderTop: "5px solid #FFBF00",
  borderRadius: "50%",
  animation: "spin 1s linear infinite",
  "@keyframes spin": {
    "0%": {
      transform: "rotate(0deg)",
    },
    "100%": {
      transform: "rotate(360deg)",
    },
  },
});

const LoadingText = styled("div")({
  marginLeft: "20px",
  color: "#FFBF00",
  fontSize: "18px",
  fontWeight: "bold",
});

interface Props {
  text?: string;
}

const Spinner = ({ text = "Loading" }: Props) => {
  return (
    <Overlay>
      <SpinnerWrapper>
        <SpinnerAnimation />
        <LoadingText>{text}...</LoadingText>
      </SpinnerWrapper>
    </Overlay>
  );
};

export default Spinner;
