import { MedplumService } from './MedplumService';

export const resolvers = {
  Query: {
    getPatient: (_, { id }, { medplumService }: { medplumService: MedplumService }) =>
      medplumService.getPatient(id),
    searchPatients: (_, { name }, { medplumService }: { medplumService: MedplumService }) =>
      medplumService.searchPatients(name),
    getPractitioner: (_, { id }, { medplumService }: { medplumService: MedplumService }) =>
      medplumService.getPractitioner(id),
    getObservation: (_, { id }, { medplumService }: { medplumService: MedplumService }) =>
      medplumService.getObservation(id),
    searchObservations: (
      _,
      { patientId, code },
      { medplumService }: { medplumService: MedplumService },
    ) => medplumService.searchObservations(patientId, code),
  },
  Mutation: {
    createPatient: (
      _,
      { name, birthDate, gender },
      { medplumService }: { medplumService: MedplumService },
    ) => medplumService.createPatient(name, birthDate, gender),
    updatePatient: (
      _,
      { id, name, birthDate, gender },
      { medplumService }: { medplumService: MedplumService },
    ) => medplumService.updatePatient(id, name, birthDate, gender),
    createObservation: (
      _,
      { patientId, code, value, unit },
      { medplumService }: { medplumService: MedplumService },
    ) => medplumService.createObservation(patientId, code, value, unit),
  },
};
