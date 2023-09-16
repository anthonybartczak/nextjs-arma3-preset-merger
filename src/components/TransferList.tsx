"use client"

import * as React from 'react';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import { htmlHeader, htmlFooter } from '../structures/HtmlContainer';
import TextField from '@mui/material/TextField';

function not(a: readonly PresetObject[], b: readonly PresetObject[]) {
  return a.filter((value) => b.indexOf(value) === -1);
}

function intersection(a: readonly PresetObject[], b: readonly PresetObject[]) {
  return a.filter((value) => b.indexOf(value) !== -1);
}

function union(a: readonly PresetObject[], b: readonly PresetObject[]) {
  return [...a, ...not(b, a)];
}

interface PresetObject {
  id: string;
  displayName: string;
  addonId: string;
  source: string;
  link: string;
}

interface SelectAllTransferListProps {
  primaryContent: PresetObject[];
  secondaryContent: PresetObject[];
}

export default function SelectAllTransferList({primaryContent, secondaryContent}: SelectAllTransferListProps) {

  const [checked, setChecked] = React.useState<PresetObject[]>([]);
  const [left, setLeft] = React.useState<PresetObject[]>(primaryContent);
  const [right, setRight] = React.useState<PresetObject[]>(secondaryContent);

  React.useEffect(() => {
    setLeft(primaryContent);
    setRight(secondaryContent);
  }, [primaryContent, secondaryContent]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  const handleToggle = (value: any) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: PresetObject[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: PresetObject[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  const handleCheckedRight = () => {
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
  };

  const handleCheckedLeft = () => {
    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
  };

  const createHtmlPreset = (addonList: PresetObject[]) => {

    const presetElement = document.getElementById('preset-name') as HTMLInputElement;
    let presetName = presetElement.value;

    if (presetName === '') { presetName = 'New preset' }

    let htmlPreset = htmlHeader(presetName);

    addonList.forEach((addon) => {
      htmlPreset += `
      <tr data-type="ModContainer">
        <td data-type="DisplayName">${addon["displayName"]}</td>
        <td>
          <span class="from-steam">${addon["source"]}</span>
        </td>
        <td>
          <a href="${addon["link"]}" data-type="Link">${addon["link"]}</a>
        </td>
      </tr>`
    });

    htmlPreset += htmlFooter;
    htmlPreset = htmlPreset.replaceAll("&", "&amp;");

    const blob = new Blob([htmlPreset], { type: 'text/html' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${presetName}.html`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  const customList = (title: React.ReactNode, items: PresetObject[], identifier: string) => (
    <Card className='!rounded-xl !bg-neutral-800'>
      <CardHeader
        className='transfer-list-header'
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
            }}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider className='!bg-neutral-800'/>
      <List
        sx={{
          width: 400,
          height: 450,
          overflow: 'auto',
        }}
        className='!bg-neutral-900 !text-gray-100'
        dense
        component="div"
        role="list"
      >
        {items.map((value) => {
          const labelId = `transfer-list-all-item-${value["addonId"]}-label`;

          return (
            <ListItem
              key={value["id"]}
              role="listitem"
              button
              onClick={handleToggle(value)}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={value["displayName"]} />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );

  return (
    <>
    <Grid container spacing={2} justifyContent="center" alignItems="center">
      <Grid item>{customList('Main addon preset', left, 'left')}</Grid>
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedRight}
            disabled={leftChecked.length === 0}
            aria-label="move selected right"
          >
            &gt;
          </Button>
          <Button
            sx={{ my: 0.5 }}
            variant="outlined"
            size="small"
            onClick={handleCheckedLeft}
            disabled={rightChecked.length === 0}
            aria-label="move selected left"
          >
            &lt;
          </Button>
        </Grid>
      </Grid>
      <Grid item>{customList('Additional addons', right, 'right')}</Grid>
    </Grid>
    <div className='!flex !flex-col !w-max'>
      <TextField
          id='preset-name'
          className='!text-gray-300'
          label="Enter the name of the preset"
          variant="outlined"
          color='primary'
          fullWidth
        />
      <Button
          sx={{ my: 0.5 }}
          className='!font-bold text-lg'
          variant="outlined"
          size="large"
          onClick={() => createHtmlPreset(left)}
          aria-label="move selected right"
      >Genearate the new addon preset
      </Button>
    </div>
  </>
  );
}