import React from 'react'
import GenderGraph from './components/gender-graph'

const OverviewGraphs = ({ genderData }) => {
    return (
        <div>
            <GenderGraph genderData={genderData} />
        </div>
    )
}

export default OverviewGraphs
