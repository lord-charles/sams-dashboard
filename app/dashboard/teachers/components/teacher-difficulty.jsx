import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import React from 'react';

const LearnerDifficulty = ({
    difficultySeeing, setDifficultySeeing,
    difficultyHearing, setDifficultyHearing,
    difficultyTalking, setDifficultyTalking,
    difficultySelfCare, setDifficultySelfCare,
    difficultyWalking, setDifficultyWalking,
    difficultyRecalling, setDifficultyRecalling
}) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Seeing Difficulty */}
            <div className="grid gap-3">
                <Label htmlFor="seeing">Seeing</Label>
                <Select
                    id="seeing"
                    aria-label="Select Seeing Difficulty"
                    value={difficultySeeing}
                    onValueChange={setDifficultySeeing}
                >
                    <SelectTrigger aria-label="Select difficulty level">
                        <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">No difficulty (1)</SelectItem>
                        <SelectItem value="2">Some difficulty (2)</SelectItem>
                        <SelectItem value="3">A lot of difficulty (3)</SelectItem>
                        <SelectItem value="4">Cannot see at all (4)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Hearing Difficulty */}
            <div className="grid gap-3">
                <Label htmlFor="hearing">Hearing</Label>
                <Select
                    id="hearing"
                    aria-label="Select Hearing Difficulty"
                    value={difficultyHearing}
                    onValueChange={setDifficultyHearing}
                >
                    <SelectTrigger aria-label="Select difficulty level">
                        <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">No difficulty (1)</SelectItem>
                        <SelectItem value="2">Some difficulty (2)</SelectItem>
                        <SelectItem value="3">A lot of difficulty (3)</SelectItem>
                        <SelectItem value="4">Cannot hear at all (4)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Talking Difficulty */}
            <div className="grid gap-3">
                <Label htmlFor="talking">Talking</Label>
                <Select
                    id="talking"
                    aria-label="Select Talking Difficulty"
                    value={difficultyTalking}
                    onValueChange={setDifficultyTalking}
                >
                    <SelectTrigger aria-label="Select difficulty level">
                        <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">No difficulty (1)</SelectItem>
                        <SelectItem value="2">Some difficulty (2)</SelectItem>
                        <SelectItem value="3">A lot of difficulty (3)</SelectItem>
                        <SelectItem value="4">Cannot talk at all (4)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Self-Care Difficulty */}
            <div className="grid gap-3">
                <Label htmlFor="self-care">Self-Care</Label>
                <Select
                    id="self-care"
                    aria-label="Select Self-Care Difficulty"
                    value={difficultySelfCare}
                    onValueChange={setDifficultySelfCare}
                >
                    <SelectTrigger aria-label="Select difficulty level">
                        <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">No difficulty (1)</SelectItem>
                        <SelectItem value="2">Some difficulty (2)</SelectItem>
                        <SelectItem value="3">A lot of difficulty (3)</SelectItem>
                        <SelectItem value="4">Lacks self-care completely (4)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Walking Difficulty */}
            <div className="grid gap-3">
                <Label htmlFor="walking">Walking</Label>
                <Select
                    id="walking"
                    aria-label="Select Walking Difficulty"
                    value={difficultyWalking}
                    onValueChange={setDifficultyWalking}
                >
                    <SelectTrigger aria-label="Select difficulty level">
                        <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">No difficulty (1)</SelectItem>
                        <SelectItem value="2">Some difficulty (2)</SelectItem>
                        <SelectItem value="3">A lot of difficulty (3)</SelectItem>
                        <SelectItem value="4">Cannot walk at all (4)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Recalling/Remembering Difficulty */}
            <div className="grid gap-3">
                <Label htmlFor="recalling">Recalling/Remembering</Label>
                <Select
                    id="recalling"
                    aria-label="Select Recalling/Remembering Difficulty"
                    value={difficultyRecalling}
                    onValueChange={setDifficultyRecalling}
                >
                    <SelectTrigger aria-label="Select difficulty level">
                        <SelectValue placeholder="Select difficulty level" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="1">No difficulty (1)</SelectItem>
                        <SelectItem value="2">Some difficulty (2)</SelectItem>
                        <SelectItem value="3">A lot of difficulty (3)</SelectItem>
                        <SelectItem value="4">Cannot remember at all (4)</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default LearnerDifficulty;
