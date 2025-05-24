// components/RatingBreakdown.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RatingStats } from '../../domain/interface/Review.interface';

interface RatingBarProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

const RatingBar: React.FC<RatingBarProps> = ({ label, count, total, color }) => {
  const percentage = total > 0 ? (count / total) * 100 : 0;
  return (
    <View style={styles.barContainer}>
      <Text style={styles.barLabel}>{label}</Text>
      <View style={styles.barBackground}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: color }]} />
      </View>
    </View>
  );
};

interface RatingBreakdownProps {
  stats: RatingStats;
}

export const RatingBreakdown: React.FC<RatingBreakdownProps> = ({ stats }) => {
  if (!stats || !stats.distribution) {
        // Sécurité au cas où stats ou distribution seraient undefined
        return null;
  }
  const { distribution, total } = stats;
  return (
    <View style={styles.container}>
      <RatingBar label="Excellent" count={distribution.excellent} total={total} color="#4CAF50" />
      <RatingBar label="Good" count={distribution.good} total={total} color="#8BC34A" />
      <RatingBar label="Average" count={distribution.average} total={total} color="#FFEB3B" />
      <RatingBar label="Below Average" count={distribution.belowAverage} total={total} color="#FF9800" />
      <RatingBar label="Poor" count={distribution.poor} total={total} color="#F44336" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 15,
    alignSelf: 'stretch', // Alternative si le parent a alignItems: 'center'
    //width: '100%'
  
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  barLabel: {
    fontSize: 14,
    color: '#555',
    width: 100, // Ajustez selon vos besoins
  },
  barBackground: {
    flex: 1,
    height: 10,
    backgroundColor: '#E0E0E0',
    borderRadius: 5,
    overflow: 'hidden', // Important pour que le barFill respecte le borderRadius
  },
  barFill: {
    height: '100%',
    borderRadius: 5,
  },
});