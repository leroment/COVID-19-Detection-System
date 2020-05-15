import React, { useEffect } from 'react';
import Menubar from '../components/Menubar';
import { Formik } from "formik";
import { makeStyles, Card, CardHeader, CardContent, Container, Grid, Typography, Input, IconButton, Icon, Button, TextField, Select, MenuItem, CardMedia, LinearProgress } from '@material-ui/core';
import { Mic } from '@material-ui/icons';
import { useState } from 'react';

const useStyles = makeStyles((theme) => ({
    container: {
        padding: theme.spacing(2),
    },
    card: {
        minWidth: 300,
        width: '50vw',
    },
    xray: {
        height: 0,
        paddingTop: '100%',
        backgroundSize: 'contain',
    }
}));

const DiagnosisScreen = () => {
    const styles = useStyles();

    const handleImageSelect = (ev, setFieldValue) => {
        const file = ev.currentTarget.files[0];
        const reader = new FileReader();
        reader.onload = () => setFieldValue('xray', reader.result);
        reader.readAsDataURL(file);
    };

    const [recordingTime, setRecordingTime] = useState(0);
    const [recording, setRecording] = useState(false);
    useEffect(() => {
        if(recording) {
            const interval = setInterval(() => {
                setRecordingTime((old) => {
                    const newVal = old + (100 / 150);
                    if(newVal > 100) {
                        setRecording(false);
                    }
                    return newVal;
                });
            }, 100);
            return () => clearInterval(interval);
        } else {
            setRecordingTime(0);
        }
    }, [recording]);

    return (
        <>
            <Menubar />
            <Formik
                initialValues={{
                    temperature: "",
                    recording: "",
                    xray: null,
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                }) => (
                    <Grid
                        container
                        className={styles.container}
                        spacing={2}
                        justify="center"
                    >
                        <Grid item>
                            <Card className={styles.card}>
                                <CardHeader title="Current Temperature" />
                                <CardContent>
                                    <Typography>
                                        Take your current temperature and enter it here.
                                    </Typography>
                                    <TextField
                                        type="number"
                                        label="Temperature (°C)"
                                        onChange={handleChange('temperature')}
                                        value={values.temperature}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={styles.card}>
                                <CardHeader title="Sound Recording" />
                                <CardContent>
                                    <Typography>
                                        Press record, then try to hold your breath for 15 seconds.
                                        Cough if you feel you need to.
                                    </Typography>
                                        <Button
                                            variant="contained"
                                            color={recording ? 'secondary' : 'primary'}
                                            endIcon={<Mic/>}
                                            onClick={() => setRecording(!recording)}
                                        >
                                            {recording ? 'Recording' : 'Record'}
                                        </Button>
                                        <LinearProgress variant="determinate" value={recordingTime} />
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item>
                            <Card className={styles.card}>
                                <CardHeader title="Chest X-Ray" />
                                <CardContent>
                                    <Typography>
                                        If you have one, please provide a recent x-ray image of your chest.
                                    </Typography>
                                    <TextField
                                        type="file"
                                        onChange={(ev) => handleImageSelect(ev, setFieldValue)}
                                    />
                                </CardContent>
                                {values.xray && (
                                    <CardMedia image={values.xray} className={styles.xray}/>
                                )}
                            </Card>
                        </Grid>
                    </Grid>
                )}
            </Formik>
        </>
    );
};

export default DiagnosisScreen;