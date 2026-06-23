// src/components/pages/OJTForm/QualityForm.tsx
import React, { useEffect, useCallback } from 'react';
import QualityAssessmentForm from '../../molecules/QualityAssessmentForm/QualityAssessmentForm';
import QualityAssessmentCriteria from '../../molecules/QualityAssessmentCriteria/QualityAssessmentCriteria';
import type { TrainingTopic, FormData } from '../../constants/types';
import { ojtApi } from '../../hooks/ServiceApis';
import toast from 'react-hot-toast';

interface QualityFormProps {
  currentEmpId: string;
  currentLevelId: number;
  currentDeptId: number;
  selectedStationId: number | null;
  qualityTopics: TrainingTopic[];
  days: string[];
  dayIdMapping: Record<string, number>;
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  setExistingOjtId: React.Dispatch<React.SetStateAction<number | null>>;
  setLastFilledDayIndex: React.Dispatch<React.SetStateAction<number>>;
  scoreRanges: { min_score: number; max_score: number } | null;
  criteria: number[];
}

const QualityForm: React.FC<QualityFormProps> = ({
  currentEmpId,
  currentLevelId,
  currentDeptId,
  selectedStationId,
  qualityTopics,
  days,
  dayIdMapping,
  formData,
  setFormData,
  setExistingOjtId,
  setLastFilledDayIndex,
  scoreRanges,
  criteria,
}) => {
  /* ------------------- FETCH ------------------- */
  useEffect(() => {
    if (!selectedStationId) {
      setExistingOjtId(null);
      setFormData((p) => ({ ...p, dailyScores: {} }));
      setLastFilledDayIndex(-1);
      return;
    }

    const load = async () => {
      try {
        const records = await ojtApi.getQualityTraineeInfoList(
          currentEmpId,
          selectedStationId,
          currentLevelId,
          currentDeptId
        );
        const record = records[0] ?? null;
        if (!record) {
          setExistingOjtId(null);
          setFormData((p) => ({ ...p, dailyScores: {} }));
          setLastFilledDayIndex(-1);
          return;
        }

        setExistingOjtId(record.id);
        const prefilled: Record<number, Record<string, string>> = {};
        record.scores_data?.forEach((s: any) => {
          const dayName =
            Object.keys(dayIdMapping).find((k) => dayIdMapping[k] === s.day) ?? `Day-${s.day}`;
          if (!prefilled[s.topic]) prefilled[s.topic] = {};
          prefilled[s.topic][dayName] = String(s.score);
        });

        const lastIdx = Math.max(
          -1,
          ...Object.values(prefilled).flatMap((obj) => days.map((d, i) => (obj[d] ? i : -1)))
        );
        setLastFilledDayIndex(lastIdx);

        setFormData((p) => ({
          ...p,
          traineeInfo: {
            ...p.traineeInfo,
            name: record.trainee_name ?? p.traineeInfo.name,
            id: record.trainer_id ?? p.traineeInfo.id,
            empNo: record.emp_id ?? p.traineeInfo.empNo,
            stationName: record.station_name ?? p.traineeInfo.stationName,
            stationId: record.station ?? p.traineeInfo.stationId,
            lineName: record.line ?? p.traineeInfo.lineName,
            processName: record.subline ?? p.traineeInfo.processName,
            revisionDate: record.revision_date ?? p.traineeInfo.revisionDate,
            doi: record.doj ?? p.traineeInfo.doi,
            trainerName: record.trainer_name ?? '',
          },
          dailyScores: prefilled,
        }));
      } catch {
        toast.error('Failed to load Quality data');
        setExistingOjtId(null);
        setFormData((p) => ({ ...p, dailyScores: {} }));
        setLastFilledDayIndex(-1);
      }
    };
    load();
  }, [
    currentEmpId,
    currentLevelId,
    currentDeptId,
    selectedStationId,
    dayIdMapping,
    days,
    setExistingOjtId,
    setFormData,
    setLastFilledDayIndex,
  ]);

  const handleScoreChange = useCallback(
    (topicId: number | string, day: string, value: string) => {
      setFormData((p) => ({
        ...p,
        dailyScores: {
          ...p.dailyScores,
          [topicId]: { ...p.dailyScores[topicId], [day]: value },
        },
      }));
    },
    []
  );

  return (
    <div className="space-y-10">
      <QualityAssessmentForm
        currentTopics={qualityTopics}
        days={days}
        formData={formData}
        handleScoreChange={handleScoreChange}
        scoreRanges={scoreRanges}
        lastFilledDayIndex={-1}
      />
      <QualityAssessmentCriteria criteria={criteria} scoreRanges={scoreRanges} />
    </div>
  );
};

export default QualityForm;