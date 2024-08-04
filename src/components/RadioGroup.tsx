import { Label } from "@/components/ui/label";
import {
  RadioGroup as RadioGroupHelper,
  RadioGroupItem,
} from "@/components/ui/radio-group";

function RadioGroup() {
  return (
    <div className="flex flex-col gap-3">
      <Label htmlFor="role">Role</Label>
      <RadioGroupHelper
        id="role"
        defaultValue="student"
        className="flex flex-col gap-2"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="student" id="student" />
          <Label htmlFor="student">Student</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="teacher" id="teacher" />
          <Label htmlFor="teacher">Teacher</Label>
        </div>
      </RadioGroupHelper>
    </div>
  );
}

export default RadioGroup;
