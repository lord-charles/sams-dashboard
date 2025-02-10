import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import { Dispatch, SetStateAction } from "react";

export default function educationSelect({
  education,
  grade,
  setGrade,
}: {
  education: string;
  grade: string;
  setGrade: Dispatch<SetStateAction<string>>;
}) {
  const handleGradeChange = (value: string) => {
    setGrade(value);
  };

  const renderSelect = () => {
    if (education === "all") {
      return (
        <Select onValueChange={handleGradeChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Primary Grades</SelectLabel>
              <SelectItem value="P1">P1</SelectItem>
              <SelectItem value="P2">P2</SelectItem>
              <SelectItem value="P3">P3</SelectItem>
              <SelectItem value="P4">P4</SelectItem>
              <SelectItem value="P5">P5</SelectItem>
              <SelectItem value="P6">P6</SelectItem>
              <SelectItem value="P7">P7</SelectItem>
              <SelectItem value="P8">P8</SelectItem>
              <SelectItem value="S1">S1</SelectItem>
              <SelectItem value="S2">S2</SelectItem>
              <SelectItem value="S3">S3</SelectItem>
              <SelectItem value="ECD1">ECD1</SelectItem>
              <SelectItem value="ECD2">ECD2</SelectItem>
              <SelectItem value="ECD3">ECD3</SelectItem>
              <SelectItem value="Level1(P1&P2)">Level1 (P1&P2)</SelectItem>
              <SelectItem value="Level2(P2&P3)">Level2 (P2&P3)</SelectItem>
              <SelectItem value="Level3(P5&P6)">Level3 (P5&P6)</SelectItem>
              <SelectItem value="Level4(P7&P8)">Level4 (P7&P8)</SelectItem>
              <SelectItem value="Level5(S1&S2)">Level5 (S1&S2)</SelectItem>
              <SelectItem value="Level6(S3&S4)">Level6 (S3&S4)</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      );
    }

    // Based on different education levels, change the Select options
    switch (education) {
      case "PRI":
        return (
          <Select onValueChange={handleGradeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Primary Grades</SelectLabel>
                <SelectItem value="P1">P1</SelectItem>
                <SelectItem value="P2">P2</SelectItem>
                <SelectItem value="P3">P3</SelectItem>
                <SelectItem value="P4">P4</SelectItem>
                <SelectItem value="P5">P5</SelectItem>
                <SelectItem value="P6">P6</SelectItem>
                <SelectItem value="P7">P7</SelectItem>
                <SelectItem value="P8">P8</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
        case "Primary":
          return (
            <Select onValueChange={handleGradeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Primary Grades</SelectLabel>
                  <SelectItem value="P1">P1</SelectItem>
                  <SelectItem value="P2">P2</SelectItem>
                  <SelectItem value="P3">P3</SelectItem>
                  <SelectItem value="P4">P4</SelectItem>
                  <SelectItem value="P5">P5</SelectItem>
                  <SelectItem value="P6">P6</SelectItem>
                  <SelectItem value="P7">P7</SelectItem>
                  <SelectItem value="P8">P8</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          );
      case "ECD":
        return (
          <Select onValueChange={handleGradeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Early Childhood Development</SelectLabel>
                <SelectItem value="ECD1">ECD1</SelectItem>
                <SelectItem value="ECD2">ECD2</SelectItem>
                <SelectItem value="ECD3">ECD3</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "ALP":
        return (
          <Select onValueChange={handleGradeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Accelerated Learning Program</SelectLabel>
                <SelectItem value="Level1(P1&P2)">Level1 (P1&P2)</SelectItem>
                <SelectItem value="Level2(P2&P3)">Level2 (P2&P3)</SelectItem>
                <SelectItem value="Level3(P5&P6)">Level3 (P5&P6)</SelectItem>
                <SelectItem value="Level4(P7&P8)">Level4 (P7&P8)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case "ASP(ASEP)":
        return (
          <Select onValueChange={handleGradeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>ASEP Grades</SelectLabel>
                <SelectItem value="Level5(S1&S2)">Level5 (S1&S2)</SelectItem>
                <SelectItem value="Level6(S3&S4)">Level6 (S3&S4)</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
        case "ASP":
          return (
            <Select onValueChange={handleGradeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>ASEP Grades</SelectLabel>
                  <SelectItem value="Level5(S1&S2)">Level5 (S1&S2)</SelectItem>
                  <SelectItem value="Level6(S3&S4)">Level6 (S3&S4)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          );
          case "ASEP":
          return (
            <Select onValueChange={handleGradeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>ASEP Grades</SelectLabel>
                  <SelectItem value="Level5(S1&S2)">Level5 (S1&S2)</SelectItem>
                  <SelectItem value="Level6(S3&S4)">Level6 (S3&S4)</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          );
      case "SEC":
        return (
          <Select onValueChange={handleGradeChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Secondary Grades</SelectLabel>
                <SelectItem value="S1">S1</SelectItem>
                <SelectItem value="S2">S2</SelectItem>
                <SelectItem value="S3">S3</SelectItem>
                <SelectItem value="S4">S4</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        );
        case "Secondary":
          return (
            <Select onValueChange={handleGradeChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder={grade ? grade : "Choose grade/class"} />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Secondary Grades</SelectLabel>
                  <SelectItem value="S1">S1</SelectItem>
                  <SelectItem value="S2">S2</SelectItem>
                  <SelectItem value="S3">S3</SelectItem>
                  <SelectItem value="S4">S4</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          );
      default:
        return null;
    }
  };

  return <div>{renderSelect()}</div>;
}
