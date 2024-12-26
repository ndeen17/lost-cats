// src/pages/TasksPage.tsx
import React, { useState } from "react";
import TaskList from "../components/TaskList";
import NotdustTaskList from "../components/NotdustTask";
import AmbassadorsTaskList from "../components/AmbassadorsTask";
import "../styles.css";

interface TasksPageProps {
  onTaskComplete: (taskId: string) => void;
}

const TasksPage: React.FC<TasksPageProps> = ({ onTaskComplete }) => {
  const [selectedTab, setSelectedTab] = useState("Partnership tasks");

  const renderTabContent = () => {
    switch (selectedTab) {
      case "Partnership tasks":
        return (
          <TaskList onTaskComplete={onTaskComplete} taskType="partnership" />
        );
      case "Notdust task":
        return (
          <NotdustTaskList onTaskComplete={onTaskComplete} taskType="notdust" />
        );
      case "Ambassadors tasks":
        return (
          <AmbassadorsTaskList
            onTaskComplete={onTaskComplete}
            taskType="ambassadors"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: "20px" }} className="tasksPage">
      <h2>Complete Tasks to Earn NDT</h2>
      <div
        style={{
          marginBottom: "20px",
          padding: "10px",
          borderRadius: "5px",
          backgroundColor: "#f8d7da",
          color: "#721c24",
          border: "1px solid #f5c6cb",
          textAlign: "center",
        }}
      >
        Hey! the more task you complete, the more $NDT you will earn.
      </div>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        {["Partnership tasks", "Notdust task", "Ambassadors tasks"].map(
          (tab) => (
            <div
              key={tab}
              onClick={() => setSelectedTab(tab)}
              style={{
                padding: "10px 20px",
                cursor: "pointer",
                borderBottom: selectedTab === tab ? "2px solid #000" : "none",
                fontWeight: selectedTab === tab ? "bold" : "normal",
              }}
            >
              {tab}
            </div>
          )
        )}
      </div>
      {renderTabContent()}
    </div>
  );
};

export default TasksPage;
