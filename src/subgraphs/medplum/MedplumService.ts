import { injectable } from 'inversify';
import { MedplumClient } from '@medplum/core';
import { Patient, Practitioner, Observation } from '@medplum/fhirtypes';

@injectable()
export class MedplumService {
  private client: MedplumClient;

  constructor() {
    this.client = new MedplumClient({
      baseUrl: process.env.MEDPLUM_BASE_URL,
      clientId: process.env.MEDPLUM_CLIENT_ID,
      clientSecret: process.env.MEDPLUM_CLIENT_SECRET,
    });
  }

  async getPatient(id: string): Promise<Patient> {
    return await this.client.readResource('Patient', id);
  }

  async searchPatients(name: string): Promise<Patient[]> {
    const bundle = await this.client.searchResources('Patient', { name: name });
    return bundle.entry?.map((e) => e.resource as Patient) || [];
  }

  async getPractitioner(id: string): Promise<Practitioner> {
    return await this.client.readResource('Practitioner', id);
  }

  async getObservation(id: string): Promise<Observation> {
    return await this.client.readResource('Observation', id);
  }

  async searchObservations(patientId: string, code: string): Promise<Observation[]> {
    const bundle = await this.client.searchResources('Observation', {
      subject: `Patient/${patientId}`,
      code: code,
    });
    return bundle.entry?.map((e) => e.resource as Observation) || [];
  }

  async createPatient(name: string, birthDate?: string, gender?: string): Promise<Patient> {
    const patient: Patient = {
      resourceType: 'Patient',
      name: [{ text: name }],
      birthDate: birthDate,
      gender: gender as 'male' | 'female' | 'other' | 'unknown',
    };
    return await this.client.createResource(patient);
  }

  async updatePatient(
    id: string,
    name?: string,
    birthDate?: string,
    gender?: string,
  ): Promise<Patient> {
    const patient = await this.getPatient(id);
    if (name) patient.name = [{ text: name }];
    if (birthDate) patient.birthDate = birthDate;
    if (gender) patient.gender = gender as 'male' | 'female' | 'other' | 'unknown';
    return await this.client.updateResource(patient);
  }

  async createObservation(
    patientId: string,
    code: string,
    value: number,
    unit: string,
  ): Promise<Observation> {
    const observation: Observation = {
      resourceType: 'Observation',
      status: 'final',
      code: {
        coding: [{ system: 'http://loinc.org', code: code }],
      },
      subject: { reference: `Patient/${patientId}` },
      effectiveDateTime: new Date().toISOString(),
      valueQuantity: {
        value: value,
        unit: unit,
        system: 'http://unitsofmeasure.org',
        code: unit,
      },
    };
    return await this.client.createResource(observation);
  }
}
