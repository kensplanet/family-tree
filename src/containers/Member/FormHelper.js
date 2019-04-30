import Typography from '@material-ui/core/Typography';
import RadioGroup from '@material-ui/core/RadioGroup';
import TextField from '@material-ui/core/TextField';
import React from 'react';

export const renderTextField = ({input, label, meta}) => {
    return (  <div><TextField fullWidth={true}
            label={label}
            {...input}
            error={meta.touched && meta.error ? true : false}
            autoComplete="off"
        />

            <Typography variant="caption" gutterBottom>
                <span style={{color: 'red'}}> {meta.touched && meta.error}</span>
            </Typography>

        </div>
    )
};

export const renderRadioGroup = ({input, meta, ...rest}) => {
    return (<div><RadioGroup
        {...input}
        {...rest}
        value={input.value}
        onChange={(event, value) => input.onChange(value)}

    />
        <Typography variant="caption" gutterBottom>
            <span style={{color: 'red'}}> {meta.touched && meta.error}</span>
        </Typography>

    </div>)
};