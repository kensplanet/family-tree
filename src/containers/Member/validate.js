import $ from 'jquery';

export default function (values) {
    const errors = {};
    const requiredFields = [
        'name',
        'birthPlace',
        'birthYear'
    ];
    requiredFields.forEach(field => {
        if (!values[field]) {
            errors[field] = 'This field is required';
        }
    });

    const numericFields = ['birthYear', 'deathYear'];
    numericFields.forEach(field => {
        if (values[field] && !$.isNumeric(values[field])) {
            errors[field] = errors[field] || 'This field should be numeric';
        }
    });

    if (values['deathYear'] <= values['birthYear']) {
        errors['deathYear'] = errors['deathYear'] || 'Death year should be greater than birth year.';
    }
    return errors;
}
