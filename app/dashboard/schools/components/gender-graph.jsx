"use client";
import React, { useState, useEffect } from "react";
import { BarChart } from "@mui/x-charts/BarChart";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import GraphLoading from "../../skeletons/graphLoading";

const GenderGraph = ({ genderData }) => {
    const [states, setStates] = useState([]);
    const [female, setFemale] = useState([]);
    const [male, setMale] = useState([]);

    useEffect(() => {
        if (genderData) {
            processData(genderData);
        }
    }, [genderData]);

    const processData = (data) => {
        const statesArray = [];
        const femaleArray = [];
        const maleArray = [];

        data.forEach((item) => {
            statesArray.push(item.state);
            femaleArray.push(item.totalFemale);
            maleArray.push(item.totalMale);
        });

        // Update states with extracted values
        setStates(statesArray);
        setFemale(femaleArray);
        setMale(maleArray);
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Learners Enrolled</CardTitle>
                <CardDescription>
                    Distribution of male and female learners across states
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div className="">
                    {states.length === 0 || female.length === 0 || male.length === 0 ? (
                        <GraphLoading />
                    ) : (
                        <div className="relative">
                            <BarChart
                                height={400}
                                className="w-[100%]"
                                series={[
                                    { data: male, label: "Male", id: "pvId" },
                                    { data: female, label: "Female", id: "uvId" },
                                ]}
                                xAxis={[
                                    {
                                        data: states,
                                        scaleType: "band",
                                        scale: {
                                            type: "band",
                                            paddingInner: 100,
                                            paddingOuter: 200,
                                        },
                                    },
                                ]}
                                margin={{ top: 20, right: 30, bottom: 50, left: 60 }}
                                tooltip={{ trigger: "axis", slotProps: {} }}
                            />
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default GenderGraph;
