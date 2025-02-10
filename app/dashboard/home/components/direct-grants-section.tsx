"use client";

import React, { useState, useEffect, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Download,
  RefreshCw,
  Info,
  MapPin,
  BarChart3,
  TableProperties,
  Search,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  Calendar,
  School,
  CreditCard,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Mock data (same as before)
const capitationGrantsData = [
  {
    id: 1,
    state: "Central Equatoria (CES)",
    pri: 179,
    sec: 31,
    otr: 76,
    tot: 286,
    lat: 4.85,
    lon: 31.58,
  },
  {
    id: 2,
    state: "Eastern Equatoria (EES)",
    pri: 133,
    sec: 8,
    otr: 31,
    tot: 172,
    lat: 4.06,
    lon: 33.73,
  },
  {
    id: 3,
    state: "Jonglei (JGL)",
    pri: 118,
    sec: 10,
    otr: 21,
    tot: 149,
    lat: 7.55,
    lon: 32.07,
  },
  {
    id: 4,
    state: "Lakes (LKS)",
    pri: 135,
    sec: 5,
    otr: 1,
    tot: 141,
    lat: 6.81,
    lon: 30.12,
  },
  {
    id: 5,
    state: "Northern Bahr el Ghazal (NBG)",
    pri: 118,
    sec: 13,
    otr: 6,
    tot: 137,
    lat: 8.77,
    lon: 26.78,
  },
  {
    id: 6,
    state: "Unity (UTY)",
    pri: 227,
    sec: 16,
    otr: 7,
    tot: 250,
    lat: 9.33,
    lon: 29.79,
  },
  {
    id: 7,
    state: "Upper Nile State (UNS)",
    pri: 169,
    sec: 8,
    otr: 8,
    tot: 185,
    lat: 9.89,
    lon: 32.72,
  },
  {
    id: 8,
    state: "Warrap (WRP)",
    pri: 408,
    sec: 30,
    otr: 20,
    tot: 458,
    lat: 8.18,
    lon: 28.36,
  },
  {
    id: 9,
    state: "Western Bahr el Ghazal (WBG)",
    pri: 84,
    sec: 6,
    otr: 7,
    tot: 97,
    lat: 7.99,
    lon: 27.99,
  },
  {
    id: 10,
    state: "Western Equatoria (WES)",
    pri: 78,
    sec: 18,
    otr: 25,
    tot: 121,
    lat: 5.34,
    lon: 28.3,
  },
];

const cashTransfersData = [
  {
    id: 1,
    state: "Abyei AA (AAA)",
    uniqueCumulative: 1,
    lat: 9.51,
    lon: 28.99,
  },
  {
    id: 2,
    state: "Central Equatoria (CES)",
    uniqueCumulative: 71351,
    lat: 4.85,
    lon: 31.58,
  },
  {
    id: 3,
    state: "Eastern Equatoria (EES)",
    uniqueCumulative: 20557,
    lat: 4.06,
    lon: 33.73,
  },
  {
    id: 4,
    state: "Jonglei (JGL)",
    uniqueCumulative: 10658,
    lat: 7.55,
    lon: 32.07,
  },
  {
    id: 5,
    state: "Lakes (LKS)",
    uniqueCumulative: 28241,
    lat: 6.81,
    lon: 30.12,
  },
  {
    id: 6,
    state: "Northern Bahr el Ghazal (NBG)",
    uniqueCumulative: 38026,
    lat: 8.77,
    lon: 26.78,
  },
  {
    id: 7,
    state: "Unity (UTY)",
    uniqueCumulative: 11440,
    lat: 9.33,
    lon: 29.79,
  },
  {
    id: 8,
    state: "Upper Nile State (UNS)",
    uniqueCumulative: 10845,
    lat: 9.89,
    lon: 32.72,
  },
  {
    id: 9,
    state: "Warrap (WRP)",
    uniqueCumulative: 45482,
    lat: 8.18,
    lon: 28.36,
  },
  {
    id: 10,
    state: "Western Bahr el Ghazal (WBG)",
    uniqueCumulative: 25592,
    lat: 7.99,
    lon: 27.99,
  },
  {
    id: 11,
    state: "Western Equatoria (WES)",
    uniqueCumulative: 18794,
    lat: 5.34,
    lon: 28.3,
  },
];

const customMarkerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

export default function DirectGrantsSection() {
  const [activeTab, setActiveTab] = useState("capitation");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);
  const [selectedYear, setSelectedYear] = useState("2024");
  const [viewMode, setViewMode] = useState<"table" | "chart" | "map">("table");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        setLastUpdated(new Date());
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredData = useMemo(() => {
    const dataToFilter =
      activeTab === "capitation" ? capitationGrantsData : cashTransfersData;
    return dataToFilter.filter((item) =>
      item.state.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, searchTerm]);

  const sortedData = useMemo(() => {
    if (!sortConfig) return filteredData;
    return [...filteredData].sort((a, b) => {
      const key = sortConfig.key as keyof typeof a;
      if (a[key] < b[key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [filteredData, sortConfig]);

  const handleSort = (key: string) => {
    setSortConfig((prevConfig) => {
      if (!prevConfig || prevConfig.key !== key) {
        return { key, direction: "ascending" };
      }
      if (prevConfig.direction === "ascending") {
        return { key, direction: "descending" };
      }
      return null;
    });
  };

  const renderSortIcon = (key: string) => {
    if (!sortConfig || sortConfig.key !== key) {
      return <ArrowUpDown className="w-4 h-4 ml-1" />;
    }
    return sortConfig.direction === "ascending" ? (
      <ChevronUp className="w-4 h-4 ml-1" />
    ) : (
      <ChevronDown className="w-4 h-4 ml-1" />
    );
  };

  const renderContent = () => {
    if (loading) {
      return <LoadingState />;
    }

    if (error) {
      return <ErrorState message={error} />;
    }

    switch (viewMode) {
      case "table":
        return (
          <DataTable
            data={sortedData}
            activeTab={activeTab}
            handleSort={handleSort}
            renderSortIcon={renderSortIcon}
          />
        );
      case "chart":
        return <DataChart data={sortedData} activeTab={activeTab} />;
      case "map":
        return <DataMap data={sortedData} activeTab={activeTab} />;
      default:
        return null;
    }
  };

  return (
    <section className="bg-gradient-to-b from-background to-background/80">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary-foreground">
            Direct Grants to Schools and Pupils
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Empowering education through strategic financial support to schools
            and students across South Sudan.
          </p>
        </div>

        <Tabs
          defaultValue="capitation"
          className="w-full"
          onValueChange={setActiveTab}
        >
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0 md:space-x-4">
                <TabsList className="mb-4 md:mb-0">
                  <TabsTrigger
                    value="capitation"
                    className="flex items-center space-x-2"
                  >
                    <School className="w-4 h-4" />
                    <span>Capitation Grants</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="cash"
                    className="flex items-center space-x-2"
                  >
                    <CreditCard className="w-4 h-4" />
                    <span>Cash Transfers</span>
                  </TabsTrigger>
                </TabsList>
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Search states..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 w-full md:w-auto"
                    />
                  </div>
                  <Select value={selectedYear} onValueChange={setSelectedYear}>
                    <SelectTrigger className="w-[120px]">
                      <Calendar className="w-4 h-4 mr-2" />
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2024">2024</SelectItem>
                      <SelectItem value="2023">2023</SelectItem>
                      <SelectItem value="2022">2022</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex space-x-2">
                    <Button
                      variant={viewMode === "table" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("table")}
                    >
                      <TableProperties className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "chart" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("chart")}
                    >
                      <BarChart3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "default" : "outline"}
                      size="icon"
                      onClick={() => setViewMode("map")}
                    >
                      <MapPin className="w-4 h-4" />
                    </Button>
                  </div>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button variant="outline" size="icon">
                          <Download className="w-4 h-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Export data</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>
                {activeTab === "capitation"
                  ? "Schools Approved to Receive Capitation Grants"
                  : "Cash Transfers to Girls and Their Families"}
              </CardTitle>
              <CardDescription>
                {activeTab === "capitation"
                  ? "Number of schools by year (T1 approved) using the 2020 Ten +3 State Model"
                  : "Cumulative number of unique students using the 2020 Ten +3 State Model"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={viewMode}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </Tabs>

        <Card className="mt-8 bg-primary/5">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-2 flex items-center">
              <Info className="w-5 h-5 mr-2" />
              About Direct Grants
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              The basis provided by the enrollment and attendance monitoring
              supports the GESS project to pay cash grants directly to Girls
              attending school (Cash Transfers), as well as to provide direct
              funding for Schools depending on their verified enrollment
              (Capitation Grants).
            </p>
            <div className="flex flex-wrap gap-4">
              <Badge variant="secondary" className="text-xs flex items-center">
                <Calendar className="w-3 h-3 mr-1" />
                Academic year, not calendar
              </Badge>
              <Button variant="link" size="sm" className="h-6 p-0">
                Cash Transfers to pupils
              </Button>
              <Button variant="link" size="sm" className="h-6 p-0">
                Capitation Grants to schools
              </Button>
              <Button variant="link" size="sm" className="h-6 p-0">
                School Grants Map
              </Button>
            </div>
          </CardContent>
        </Card>

        {lastUpdated && (
          <div className="mt-4 text-sm text-muted-foreground text-right">
            Last updated: {lastUpdated.toLocaleString()}
          </div>
        )}
      </div>
    </section>
  );
}

function LoadingState() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-8 w-full" />
    </div>
  );
}

function ErrorState({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

function DataTable({
  data,
  activeTab,
  handleSort,
  renderSortIcon,
}: {
  data: any[];
  activeTab: string;
  handleSort: (key: string) => void;
  renderSortIcon: (key: string) => JSX.Element;
}) {
  return (
    <ScrollArea className="h-[400px]">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              className="w-[180px] cursor-pointer"
              onClick={() => handleSort("state")}
            >
              <div className="flex items-center">
                State {renderSortIcon("state")}
              </div>
            </TableHead>
            {activeTab === "capitation" ? (
              <>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("pri")}
                >
                  <div className="flex items-center">
                    Primary {renderSortIcon("pri")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("sec")}
                >
                  <div className="flex items-center">
                    Secondary {renderSortIcon("sec")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("otr")}
                >
                  <div className="flex items-center">
                    Other {renderSortIcon("otr")}
                  </div>
                </TableHead>
                <TableHead
                  className="cursor-pointer"
                  onClick={() => handleSort("tot")}
                >
                  <div className="flex items-center">
                    Total {renderSortIcon("tot")}
                  </div>
                </TableHead>
              </>
            ) : (
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort("uniqueCumulative")}
              >
                <div className="flex items-center">
                  Unique Cumulative {renderSortIcon("uniqueCumulative")}
                </div>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              <TableCell className="font-medium">{row.state}</TableCell>
              {activeTab === "capitation" ? (
                <>
                  <TableCell>{row.pri}</TableCell>
                  <TableCell>{row.sec}</TableCell>
                  <TableCell>{row.otr}</TableCell>
                  <TableCell>{row.tot}</TableCell>
                </>
              ) : (
                <TableCell>{row.uniqueCumulative.toLocaleString()}</TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

function DataChart({ data, activeTab }: { data: any[]; activeTab: string }) {
  const chartData = data.map((item: any) => ({
    name: item.state,
    ...(activeTab === "capitation"
      ? {
          Primary: item.pri,
          Secondary: item.sec,
          Other: item.otr,
          Total: item.tot,
        }
      : { "Unique Cumulative": item.uniqueCumulative }),
  }));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart
        data={chartData}
        layout="vertical"
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis type="number" />
        <YAxis dataKey="name" type="category" width={150} />
        <RechartsTooltip />
        <Legend />
        {activeTab === "capitation" ? (
          <>
            <Bar dataKey="Primary" fill="#8884d8" />
            <Bar dataKey="Secondary" fill="#82ca9d" />
            <Bar dataKey="Other" fill="#ffc658" />
            <Bar dataKey="Total" fill="#ff7300" />
          </>
        ) : (
          <Bar dataKey="Unique Cumulative" fill="#8884d8" />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

function DataMap({ data, activeTab }: { data: any[]; activeTab: string }) {
  return (
    <div style={{ height: "400px", width: "100%" }}>
      <MapContainer
        center={[7.5, 30]}
        zoom={6}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {data.map((item) => (
          <Marker
            key={item.id}
            position={[item.lat, item.lon]}
            icon={customMarkerIcon}
          >
            <Popup>
              <strong>{item.state}</strong>
              <br />
              {activeTab === "capitation"
                ? `Total Schools: ${item.tot}`
                : `Unique Cumulative: ${item.uniqueCumulative.toLocaleString()}`}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
