import React from "react";

const rows = [
  "row1",
  "row2",
  "row3",
]

const MyPage = () => {
        return(
            <div>
                {rows.slice(3, 1).map(row => {
                return (
                  <button/>
                );
                })}
            </div>
        )
    
}

export default MyPage