# Current State of the Repository

## Last Updated: [Current Date]

### Key Files and Their States:

1. package.json:
   - Updated dependencies, including:
     - @medplum/core: ^2.5.5
     - @medplum/fhirtypes: ^2.5.5
     - @medplum/fhir-types: 3.2.13 (newly added)
   - Removed some GraphQL tools dependencies
   - Updated AWS SDK dependencies

2. src/index.ts:
   - Entry point for the application
   - Imports and uses the necessary modules to start the server

3. src/application/:
   - Contains core application logic
   - Includes WorkflowService, WorkflowEngine, and CopService

4. src/domain/:
   - Defines domain entities and types
   - Includes WorkflowDefinition, WorkflowInstance, and CopRule

5. src/infrastructure/:
   - Implements infrastructure concerns
   - Includes database adapters, repositories, and cloud provider integrations

6. src/subgraphs/:
   - Contains subgraph definitions for the federated GraphQL schema
   - Includes workflow, accounting, timetrex, and medplum subgraphs

7. src/utils/:
   - Utility functions and helpers
   - Includes error handling, logging, and resilience utilities

8. Configuration files:
   - tsconfig.json, .eslintrc.json, .prettierrc: Define TypeScript, linting, and code formatting rules

### Recent Changes:
- Updated Medplum dependencies in package.json
- Implemented DynamoDB repositories for workflows and workflow templates
- Added caching layer using Redis for workflow templates
- Implemented GraphQL resolvers for workflow operations

### Next Steps:
- Implement remaining CRUD operations for workflows and templates
- Add more comprehensive error handling and logging
- Implement authentication and authorization
- Set up CI/CD pipeline for automated testing and deployment

Note: This summary represents the current state of the project based on the most recent changes and discussions. Always refer to the actual code and configuration files for the most up-to-date and detailed information.