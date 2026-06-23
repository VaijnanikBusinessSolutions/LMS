// src/components/pages/OJTForm/QuantityForm.tsx
import React, { useEffect, useCallback } from 'react';
import QuantityAssessmentForm from '../../molecules/QuantityAssessmentForm/QuantityAssessmentForm';
import ProductionMarkingScheme from '../../molecules/ProductionMarkingScheme/ProductionMarkingScheme';
import type { FormData, QuantityEvaluation } from '../../constants/types';
import { ojtApi } from '../../hooks/ServiceApis';
import toast from 'react-hot-toast';

interface QuantityFormProps {
  currentEmpId: string;
  currentLevelId: number;
  currentDeptId: number;
  selectedStationId: number | null;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setExistingQuantityId: React.Dispatch<React.SetStateAction<number | null>>;
  setQuantityEvaluations: React.Dispatch<React.SetStateAction<QuantityEvaluation[]>>;
  setStatus: React.Dispatch<React.SetStateAction<string>>;
  quantityScoreRange: any[] | null;
  quantityCriteria: any;
  handleInputChange: (section: string, field: string, value: string) => void;
}

const QuantityForm: React.FC<QuantityFormProps> = ({
  currentEmpId,
  currentLevelId,
  currentDeptId,
  selectedStationId,
  formData,
  setFormData,
  setExistingQuantityId,
  setQuantityEvaluations,
  setStatus,
  quantityScoreRange,
  quantityCriteria,
  handleInputChange,
}) => {
  /* ------------------- FETCH ------------------- */
  useEffect(() => {
    if (!selectedStationId) {
      setExistingQuantityId(null);
      setQuantityEvaluations([
        {
          day: 1,
          date: new Date().toISOString().split('T')[0],
          plan: 0,
          production_actual: 0,
          production_marks: 0,
          rejection_marks: 0,
          number_of_rejections: 0,
        },
      ]);
      setStatus('Pending');
      return;
    }

    const load = async () => {
      try {
        const records = await ojtApi.getQuantityTraineeInfoList(
          currentEmpId,
          currentLevelId,
          selectedStationId,
          currentDeptId
        );
        const record = records[0] ?? null;
        if (!record) {
          setExistingQuantityId(null);
          setQuantityEvaluations([
            {
              day: 1,
              date: new Date().toISOString().split('T')[0],
              plan: 0,
              production_actual: 0,
              production_marks: 0,
              rejection_marks: 0,
              number_of_rejections: 0,
            },
          ]);
          setStatus('Pending');
          return;
        }

        setExistingQuantityId(record.id);
        setQuantityEvaluations(record.evaluations_data ?? []);
        setStatus(record.status ?? 'Pending');

        setFormData((p) => ({
          ...p,
          traineeInfo: {
            ...p.traineeInfo,
            name: record.trainee_name ?? p.traineeInfo.name,
            id: record.trainee_id ?? p.traineeInfo.id,
            empNo: record.emp_id ?? p.traineeInfo.empNo,
            stationName: record.station_name ?? p.traineeInfo.stationName,
            stationId: record.station ?? p.traineeInfo.stationId,
            lineName: record.line_name ?? p.traineeInfo.lineName,
            processName: record.process_name ?? p.traineeInfo.processName,
            revisionDate: record.revision_date ?? p.traineeInfo.revisionDate,
            doi: record.doj ?? p.traineeInfo.doi,
            trainerName: record.trainer_name ?? '',
          },
          signatures: { ...p.signatures, engineerJudge: record.engineer_judge ?? '' },
        }));
      } catch {
        toast.error('Failed to load Quantity data');
        setExistingQuantityId(null);
        setQuantityEvaluations([
          {
            day: 1,
            date: new Date().toISOString().split('T')[0],
            plan: 0,
            production_actual: 0,
            production_marks: 0,
            rejection_marks: 0,
            number_of_rejections: 0,
          },
        ]);
      }
    };
    load();
  }, [
    currentEmpId,
    currentLevelId,
    currentDeptId,
    selectedStationId,
    setExistingQuantityId,
    setFormData,
    setQuantityEvaluations,
    setStatus,
  ]);

  const handleQuantityEvaluationChange = useCallback(
    (index: number, field: keyof QuantityEvaluation, value: string | number) => {
      setQuantityEvaluations((prev) => {
        const copy = [...prev];
        copy[index] = { ...copy[index], [field]: value };
        return copy;
      });
    },
    []
  );

  const addEvaluationDay = useCallback(() => {
    setQuantityEvaluations((prev) => [
      ...prev,
      {
        day: prev.length + 1,
        date: new Date().toISOString().split('T')[0],
        plan: 0,
        production_actual: 0,
        production_marks: 0,
        rejection_marks: 0,
        number_of_rejections: 0,
      },
    ]);
  }, []);

  const removeEvaluationDay = useCallback((index: number) => {
    setQuantityEvaluations((prev) => {
      const filtered = prev.filter((_, i) => i !== index);
      return filtered.map((e, i) => ({ ...e, day: i + 1 }));
    });
  }, []);

  return (
    <div className="space-y-10">
      <QuantityAssessmentForm
        formData={formData}
        quantityEvaluations={quantityEvaluations}
        scoreRange={quantityScoreRange}
        handleQuantityEvaluationChange={handleQuantityEvaluationChange}
        addEvaluationDay={addEvaluationDay}
        removeEvaluationDay={removeEvaluationDay}
        handleInputChange={handleInputChange}
      />
      <div className="lg:col-span-2">
        <ProductionMarkingScheme criteria={quantityCriteria} scoreRange={quantityScoreRange} />
      </div>
    </div>
  );
};

export default QuantityForm;