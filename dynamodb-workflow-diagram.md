k```mermaid
erDiagram
    WORKFLOW_DEFINITIONS ||--o{ WORKFLOW_INSTANCES : "has many"
    WORKFLOW_INSTANCES ||--o{ WORKFLOW_HISTORY : "has many"
    COP_RULES ||--o{ WORKFLOW_INSTANCES : "applies to"

    WORKFLOW_DEFINITIONS {
        string PK "WORKFLOW_DEF#<id>"
        string SK "WORKFLOW_DEF#<id>"
        string id
        string name
        string initialState
        map context
        map states
    }

    WORKFLOW_INSTANCES {
        string PK "WORKFLOW_INST#<id>"
        string SK "WORKFLOW_INST#<id>"
        string id
        string definitionId
        string currentState
        map context
        list history
    }

    WORKFLOW_HISTORY {
        string PK "WORKFLOW_HIST#<instanceId>"
        string SK "<timestamp>"
        string instanceId
        string state
        map context
        string event
    }

    COP_RULES {
        string PK "COP_RULE#<id>"
        string SK "COP_RULE#<id>"
        string id
        string name
        string description
        string condition
        string action
    }
```