import { Card, CardContent } from "@/components/ui/card";
import {
  School,
  User,
  Phone,
  Building2,
  MapPin,
  CreditCard,
  FileText,
  Users,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useMetaStore } from "@/app/store/meta-store";
import type { Committee } from "@/app/store/meta-store";

export default function General({ info }: { info: any }) {
  const { meta, updateBudget } = useMetaStore();

  const handleBudgetImpactChange = (value: string) => {
    updateBudget({ impact: value });
  };

  const handleCommitteeChange = (field: keyof Committee, value: string) => {
    updateBudget({
      committee: {
        ...(meta?.budget?.committee || {}),
        [field]: value,
      },
    });
  };

  return (
    <Card className="min-h-screen p-3 bg-transparent">


      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard
          title="School Information"
          icon={<Building2 className="h-5 w-5 text-primary" />}
          items={[
            { label: "EMIS ID", value: info?.emisId || "N/A" },
            { label: "Code", value: info?.code || "N/A" },
            { label: "Type", value: info?.schoolType || "N/A" },
            { label: "Ownership", value: info?.schoolOwnerShip || "N/A" },
            { label: "Bank Name", value: info?.bankDetails?.bankName || "N/A" },
            {
              label: "Account Name",
              value: info?.bankDetails?.accountName || "N/A",
            },
          ]}
        />
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Contact Information</h2>
            </div>
            <div className="space-y-2">
              <ContactPerson
                title="Head Teacher"
                name={info?.headTeacher?.name || "N/A"}
                phone={info?.headTeacher?.phoneNumber || "N/A"}
              />
              <ContactPerson title="PTA" name={info?.pta?.name || "N/A"} />
              <ContactPerson
                title="Reporter"
                name={info?.reporter?.name || "N/A"}
                phone={info?.reporter?.phoneNumber || "N/A"}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Budget Impact</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Describe the expected impact of the budget on the school&apos;s
                operations and student outcomes.
              </p>
              <Textarea
                className="w-full h-32"
                placeholder="Enter budget impact details..."
                value={meta?.budget?.impact}
                onChange={(e) => handleBudgetImpactChange(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-semibold">Responsible Committee</h2>
            </div>
            <div className="space-y-4">
              <p className="text-gray-700">
                Provide details about the committee responsible for overseeing
                the budget implementation.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="Committee Name"
                  value={meta?.budget?.committee?.name || ""}
                  onChange={(e) =>
                    handleCommitteeChange("name", e.target.value)
                  }
                />
                <Input
                  type="text"
                  placeholder="Chairperson"
                  value={meta?.budget?.committee?.chairperson || ""}
                  onChange={(e) =>
                    handleCommitteeChange("chairperson", e.target.value)
                  }
                />
              </div>
              <Textarea
                className="w-full h-32"
                placeholder="Committee responsibilities and members..."
                value={meta?.budget?.committee?.responsibilities || ""}
                onChange={(e) =>
                  handleCommitteeChange("responsibilities", e.target.value)
                }
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </Card>
  );
}

function InfoCard({
  title,
  icon,
  items,
}: {
  title: string;
  icon: React.ReactNode;
  items: { label: string; value: string }[];
}) {
  return (
    <Card>
      <div className="px-4 pt-6">
        <div className="flex items-center gap-2 mb-2">
          {icon}
          <h2 className="text-xl font-semibold">{title}</h2>
        </div>
        <div className="space-y-3">
          {items?.map((item, index) => (
            <InfoRow key={index} label={item?.label} value={item?.value} />
          ))}
        </div>
      </div>
    </Card>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function ContactPerson({
  title,
  name,
  phone,
}: {
  title: string;
  name: string;
  phone?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <h3 className="font-medium text-primary mb-2">{title}</h3>
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span>{name}</span>
        </div>
        {phone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-gray-500" />
            <span>{phone}</span>
          </div>
        )}
      </div>
    </div>
  );
}
