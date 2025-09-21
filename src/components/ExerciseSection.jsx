import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw, Heart, Zap, Wind, Bike, Timer } from 'lucide-react';

const ExerciseSection = () => {
  const [activeExercise, setActiveExercise] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [exerciseProgress, setExerciseProgress] = useState({});

  const exercises = [
    {
      id: 'breathing',
      name: 'Breathing Exercise',
      icon: Wind,
      duration: 300, // 5 minutes
      description: 'Deep breathing to reduce stress and improve focus',
      instructions: [
        'Sit comfortably with your back straight',
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Exhale slowly through your mouth for 6 counts',
        'Repeat this cycle'
      ],
      benefits: ['Reduces stress', 'Improves focus', 'Lowers blood pressure']
    },
    {
      id: 'cardio',
      name: 'Light Cardio',
      icon: Heart,
      duration: 900, // 15 minutes
      description: 'Gentle cardiovascular exercise',
      instructions: [
        'Start with light marching in place',
        'Gradually increase intensity',
        'Include arm movements',
        'Maintain steady breathing',
        'Cool down gradually'
      ],
      benefits: ['Improves heart health', 'Boosts energy', 'Burns calories']
    },
    {
      id: 'cycling',
      name: 'Stationary Cycling',
      icon: Bike,
      duration: 1200, // 20 minutes
      description: 'Low-impact cycling exercise',
      instructions: [
        'Adjust seat to proper height',
        'Start with low resistance',
        'Maintain steady pace',
        'Keep shoulders relaxed',
        'Gradually increase intensity'
      ],
      benefits: ['Strengthens legs', 'Low impact on joints', 'Improves endurance']
    },
    {
      id: 'stretching',
      name: 'Stretching Routine',
      icon: Zap,
      duration: 600, // 10 minutes
      description: 'Full body stretching for flexibility',
      instructions: [
        'Warm up with light movement',
        'Hold each stretch for 15-30 seconds',
        'Breathe deeply during stretches',
        'Don\'t bounce or force movements',
        'Focus on major muscle groups'
      ],
      benefits: ['Improves flexibility', 'Reduces muscle tension', 'Prevents injury']
    }
  ];

  React.useEffect(() => {
    let interval;
    if (isRunning && activeExercise) {
      interval = setInterval(() => {
        setTimer((prevTimer) => {
          const newTimer = prevTimer + 1;
          const progress = (newTimer / activeExercise.duration) * 100;
          
          setExerciseProgress(prev => ({
            ...prev,
            [activeExercise.id]: Math.min(progress, 100)
          }));

          if (newTimer >= activeExercise.duration) {
            setIsRunning(false);
            return activeExercise.duration;
          }
          return newTimer;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, activeExercise]);

  const startExercise = (exercise) => {
    setActiveExercise(exercise);
    setTimer(0);
    setIsRunning(true);
  };

  const pauseResume = () => {
    setIsRunning(!isRunning);
  };

  const resetExercise = () => {
    setTimer(0);
    setIsRunning(false);
    if (activeExercise) {
      setExerciseProgress(prev => ({
        ...prev,
        [activeExercise.id]: 0
      }));
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      <Card className="border-0 shadow-soft bg-gradient-warm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Zap className="w-5 h-5" />
            Daily Exercises
          </CardTitle>
          <CardDescription className="text-white/80">
            Simple exercises to maintain your health and wellness
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Active Exercise Timer */}
      {activeExercise && (
        <Card className="border-0 shadow-soft bg-gradient-hero">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-white">
              <Timer className="w-5 h-5" />
              {activeExercise.name} - {formatTime(timer)}
            </CardTitle>
            <CardDescription className="text-white/80">
              {activeExercise.description}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Progress 
                value={exerciseProgress[activeExercise.id] || 0} 
                className="h-3 bg-white/20"
              />
              
              <div className="flex gap-2 justify-center">
                <Button 
                  variant="outline" 
                  onClick={pauseResume}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  {isRunning ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                  {isRunning ? 'Pause' : 'Resume'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={resetExercise}
                  className="bg-white/20 border-white/30 text-white hover:bg-white/30"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>

              <div className="bg-white/10 p-4 rounded-lg">
                <h4 className="font-medium text-white mb-2">Instructions:</h4>
                <ul className="text-white/90 text-sm space-y-1">
                  {activeExercise.instructions.map((instruction, index) => (
                    <li key={index}>• {instruction}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exercise Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {exercises.map((exercise) => {
          const IconComponent = exercise.icon;
          const progress = exerciseProgress[exercise.id] || 0;
          
          return (
            <Card key={exercise.id} className="border-0 shadow-soft bg-gradient-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <IconComponent className="w-5 h-5 text-primary" />
                  {exercise.name}
                </CardTitle>
                <CardDescription>
                  {exercise.description} • Duration: {Math.floor(exercise.duration / 60)} minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {progress > 0 && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-medium text-sm">Benefits:</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {exercise.benefits.map((benefit, index) => (
                      <li key={index}>• {benefit}</li>
                    ))}
                  </ul>
                </div>

                <Button 
                  onClick={() => startExercise(exercise)}
                  disabled={activeExercise?.id === exercise.id && isRunning}
                  className="w-full"
                >
                  <Play className="w-4 h-4 mr-2" />
                  {activeExercise?.id === exercise.id && isRunning ? 'In Progress...' : 'Start Exercise'}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ExerciseSection;