import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
export const CustomAccordion = ({ title, children }) => {
  return (
    <Accordion
      className=" mb-3 border-2 border-solid bg-none"
      sx={{
        backgroundColor: "transparent",
        boxShadow: "none",
      }}
    >
      <AccordionSummary
        aria-controls={`${title.toLowerCase()}-content`}
        id={`${title.toLowerCase()}-header`}
        className="font-semibold"
        expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
      >
        <h2 className="text-2xl text-slate-100 max-sm:text-lg">{title}</h2>
      </AccordionSummary>
      <AccordionDetails>
        <div className="text-lg text-slate-100 max-sm:text-base">
          {children}
        </div>
      </AccordionDetails>
    </Accordion>
  );
};
